const { Posts, SharedPosts, transaction } = require("../models");
const { stringifyMe } = require("../utils");

module.exports = {
  sharePostService: async (userId, postId) => {
    try {
      let originalPost = await Posts.findOne({
        where: { id: postId },
        attributes: ["userId", "text", "media"],
      });

      if (originalPost.isShared) {
        const previousSharedPost = SharedPosts.findOne({
          where: { sharedPostId: postId },
          attributes: ["originalPostId"],
        });

        originalPost = await Posts.findOne({
          where: { id: previousSharedPost.originalPostId },
        });
      }

      return await transaction(async (transaction) => {
        const sharedPost = await Posts.create(
          {
            ...stringifyMe(originalPost),
            userId,
            isShared: true,
          },
          { transaction }
        );

        await SharedPosts.create(
          {
            originalPostId: originalPost.id,
            sharedPostId: sharedPost.id,
            ownerId: originalPost.userId,
          },
          { transaction }
        );

        return {
          statusCode: 201,
          message: "Post Shared Successfully !!!",
        };
      });
    } catch (err) {
      throw err;
    }
  },
};
