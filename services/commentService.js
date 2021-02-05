const {
  Comments,
  Posts,
  transaction,
  Likes,
  Notifications,
  Sequelize,
} = require("../models");
const { stringifyMe } = require("../utils");
const { likeCheck } = require("./utils");

const destroySingleComment = async (comment, transaction) => {
  if (comment.media) {
    await deleteFile(process.env.COMMENTS_FILE_PATH + comment.media);
  }

  await Likes.destroy(
    {
      where: { typeId: comment.id, likeType: "COMMENT" },
    },
    { transaction }
  );

  await Notifications.destroy({
    where: Sequelize.or(
      { postId: comment.postId, type: "COMMENT" },
      { postId: comment.postId, type: "LIKECOMMENT" }
    ),
  });
  await comment.destroy({ transaction });
};

module.exports = {
  addCommentService: async (userId, { postId, text }) => {
    try {
      const post = await Posts.findOne({ where: { id: postId } });
      if (!post) {
        return {
          statusCode: 404,
          message: "No Such Post Found !!!",
        };
      }

      return await transaction(async (transaction) => {
        try {
          await Comments.create({ userId, postId, text }, { transaction });
          ++post.totalComments;
          await post.save({ transaction });
          return {
            statusCode: 201,
            message: "Comment Created.",
          };
        } catch (err) {
          throw err;
        }
      });
    } catch (err) {
      throw err;
    }
  },

  destroyCommentService: async (userId, id) => {
    try {
      const comment = await Comments.findOne({ where: { id } });
      if (!comment) {
        return {
          statusCode: 404,
          message: "Comment not Found !!!",
        };
      }

      if (comment.userId !== userId) {
        return {
          statusCode: 401,
          message: "This Comment doesn't belongs to You !!!",
        };
      }
      return await transaction(async (transaction) => {
        await Posts.decrement(
          { total_comments: 1 },
          { where: { id: comment.postId } },
          { transaction }
        );

        await destroySingleComment(comment, transaction);

        return {
          statusCode: 200,
          message: "Comment Deleted !!!",
        };
      });
    } catch (err) {
      throw err;
    }
  },

  updateCommentService: async (userId, { id, text }) => {
    try {
      const comment = await Comments.update(
        { text },
        { where: { id, userId } }
      );
      if (!comment) {
        return {
          statusCode: 404,
          message:
            "Either User is not valid or Comment does not exist anymore.",
        };
      }

      return {
        statusCode: 200,
        message: "Comment Updated.",
      };
    } catch (err) {
      throw err;
    }
  },

  postCommentsService: async (userId, postId) => {
    try {
      const _postComments = await Comments.findAll({
        where: { postId },
        order: [["created_at", "DESC"]],
      });
      const postComments = await likeCheck(
        stringifyMe(_postComments),
        "COMMENT",
        userId
      );
      return {
        statusCode: 200,
        name: "comments",
        value: postComments,
      };
    } catch (err) {
      throw err;
    }
  },

  destroySingleComment,
};
