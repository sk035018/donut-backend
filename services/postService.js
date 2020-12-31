const { posts, users, comments, transaction } = require("../models");
const { deleteFile } = require("../utils");

module.exports = {
  newPostService: async (id, _post) => {
    try {
      const post = {
        userId: id,
        ..._post,
      };

      await posts.create(post);

      return {
        statusCode: 201,
        message: "New Post Created !!!",
      };
    } catch (err) {
      throw err;
    }
  },

  destroyPostService: async (userId, id) => {
    try {
      const post = await posts.findOne({ where: { id } });

      if (!post) {
        throw new Error("No Such Post Found !!!");
      }

      if (post.userId !== userId) {
        throw new Error("You are not a Valid User !!!");
      }

      if (post.media) {
        await deleteFile(post.media);
      }

      await transaction(async (transaction) => {
        await comments.destroy({ where: { postId: id } }, { transaction });
        await post.destroy({ transaction });
      })

      return {
        statusCode: 201,
        message: "Post Deleted !!!",
      };
    } catch (err) {
      throw err;
    }
  },

  allPostsService: async () => {
    try {
      const allPosts = await posts.findAll({
        include: [
          {
            model: users,
            attributes: ["fullName", "userName", "profilePic"],
          },
        ],
      });
      return {
        statusCode: 200,
        message: "Posts Displayed !!!",
        name: "posts",
        value: allPosts,
      };
    } catch (err) {
      throw err;
    }
  },

  myPostsService: async (userId) => {
    try {
      const myPosts = await posts.findAll({ where: { userId } });
      return {
        message: "Posts Displayed !!!",
        statusCode: 200,
        name: "posts",
        value: myPosts,
      };
    } catch (err) {
      throw err;
    }
  },
};
