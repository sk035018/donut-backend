const { comments } = require("../models");

module.exports = {
  addCommentService: async (userId, { postId, message }) => {
    try {
      const comment = await comments.create({ userId, postId, message });
      return {
        statusCode: 201,
        name: "comment",
        value: comment,
        message: "Comment Created.",
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  destroyCommentService: async (userId, id) => {
    try {
      const comment = await comments.findOne({ where: { id } });
      if (comment.userId === userId) {
        await comment.destroy();

        return {
          statusCode: 202,
          message: "Comment Deleted.",
        };
      } else {
        throw new Error("This comment doesn't belongs to you.");
      }
    } catch (err) {
      throw err;
    }
  },

  updateCommentService: async function ({ id, message }) {
    try {
      const comment = await comments.findOne({ where: { id } });
      if (comment.userId === userId) {
        comment.message = message;
        await comment.save();

        return {
          statusCode: 202,
          message: "comment Updated.",
          name: "comment",
          value: comment,
        };
      } else {
        throw new Error("This comment doesn't belongs to you.");
      }
    } catch (err) {
      throw err;
    }
  },
};
