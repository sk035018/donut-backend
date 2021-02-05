const {
  Posts,
  Comments,
  Likes,
  transaction,
  Friends,
  SharedPosts,
  Notifications,
  Sequelize,
} = require("../models");

const { deleteFile, stringifyMe } = require("../utils");
const { likeCheck, friendList } = require("./utils");
const { destroySingleComment } = require("./commentService");

const destroySinglePost = async (post, transaction) => {
  if (!post.isShared && post.media) {
    await deleteFile(process.env.POSTS_FILE_PATH + post.media);
  }
  const commentList = await Comments.findAll({
    where: { postId: post.id },
    attributes: ["id", "media", "postId"],
  });

  for (let i = 0; i < commentList.length; i++) {
    await destroySingleComment(commentList[i], transaction);
  }

  await Likes.destroy(
    { where: { typeId: post.id, likeType: "POST" } },
    { transaction }
  );
  if (post.isShared) {
    await SharedPosts.destroy(
      { where: { sharedPostsId: post.id } },
      { transaction }
    );
  }

  await Notifications.destroy({ where: { postId: post.id } }, { transaction });
  await post.destroy({ transaction });
};

module.exports = {
  newPostService: async (id, _post) => {
    try {
      const post = {
        userId: id,
        ..._post,
      };

      const newPost = await Posts.create(post);

      return {
        statusCode: 201,
        message: "New Post Created !!!",
        name: "post",
        value: newPost,
      };
    } catch (err) {
      throw err;
    }
  },

  destroyPostService: async (userId, id, post) => {
    try {
      if (!post) post = await Posts.findOne({ where: { id } });

      if (!post) {
        return {
          statusCode: 404,
          message: "No Such Post Found !!!",
        };
      }

      if (post.userId !== userId) {
        return {
          statusCode: 401,
          message: "This Post Doesn't Belongs to you !!!",
        };
      }

      const _sharedPosts = await SharedPosts.findAll({
        where: { originalPostId: id },
        attributes: ["sharedPostId"],
      });

      const sharedPostIds = stringifyMe(_sharedPosts).map(
        ({ sharedPostId }) => sharedPostId
      );

      const sharedPosts = await Posts.findAll({ where: { id: sharedPostIds } });

      return await transaction(async (transaction) => {
        for (let i = 0; i < sharedPosts.length; ++i) {
          await destroySinglePost(sharedPosts[i], transaction);
        }

        await destroySinglePost(post, transaction);

        return {
          statusCode: 201,
          message: "Post Deleted !!!",
        };
      });
    } catch (err) {
      throw err;
    }
  },

  allPostsService: async () => {
    try {
      const allPosts = await Posts.findAll({
        order: [["created_at", "DESC"]],
      });
      return {
        statusCode: 200,
        name: "posts",
        value: allPosts,
      };
    } catch (err) {
      throw err;
    }
  },

  myPostsService: async (userId) => {
    try {
      const myPosts = await Posts.findAll({
        where: { userId },
        order: [["created_at", "DESC"]],
      });
      return {
        statusCode: 200,
        name: "posts",
        value: myPosts,
      };
    } catch (err) {
      throw err;
    }
  },

  friendsPostsService: async (userId) => {
    try {
      const friendsId = await friendList(userId);

      const _friendsPosts = await Posts.findAll({
        where: { userId: friendsId },
        order: [["created_at", "DESC"]],
      });
      const friendsPosts = await likeCheck(
        stringifyMe(_friendsPosts),
        "POST",
        userId
      );
      return {
        statusCode: 200,
        name: "posts",
        value: friendsPosts,
      };
    } catch (err) {
      throw err;
    }
  },

  editPostService: async (id, { id: postId, text, media }) => {
    try {
      const post = await Posts.findOne({ where: { id: postId } });
      if (!post) {
        return {
          statusCode: 404,
          message: "No Such Post Found.",
        };
      }

      if (post.userId !== id) {
        return {
          statusCode: 401,
          message: "This Post doesn't belongs to you.",
        };
      }
      if (media !== post.media && post.media) {
        await deleteFile(process.env.POSTS_FILE_PATH + post.media);
      }
      post.text = text;
      post.media = media ? media : null;
      await post.save();
      return {
        statusCode: 200,
        message: "Post Updated",
      };
    } catch (err) {
      throw err;
    }
  },

  getPostService: async (id, postId) => {
    try {
      const post = await Posts.findOne({ where: { id: postId } });

      const connection = await Friends.findOne({
        where: {
          ...Sequelize.or(
            { user1: id, user2: post.userId },
            { user1: post.userId, user2: id }
          ),
          accepted: true,
        },
      });

      if (connection || post.userId === id) {
        return {
          statusCode: 200,
          name: "post",
          value: post,
        };
      } else {
        return {
          statusCode: 401,
          message: "You are not connected with Post Creator.",
        };
      }
    } catch (err) {
      throw err;
    }
  },

  destroySinglePost,
};
