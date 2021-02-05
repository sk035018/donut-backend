const {
  Posts,
  Likes,
  transaction,
  Comments,
  Notifications,
} = require("../models");

module.exports = {
  operateLikeService: async (userId, typeId, likeType) => {
    try {
      const dbTable = likeType === "POST" ? Posts : Comments;
      const type = await dbTable.findOne({ where: { id: typeId } });
      if (!type) {
        return {
          statusCode: 404,
          message: "No Such Entry Found",
        };
      }

      const like = await Likes.findOne({ where: { typeId, userId } });

      let message;

      return await transaction(async (transaction) => {
        if (like) {
          if (type.totalLikes > 0) --type.totalLikes;
          await Notifications.destroy(
            {
              where: {
                type: ["LIKEPOST", "LIKECOMMENT"],
                postId: like.typeId,
                from: userId,
              },
            },
            { transaction }
          );
          await like.destroy({ transaction });
          message = "Like Removed";
        } else {
          ++type.totalLikes;
          await Likes.create({ userId, typeId, likeType }, { transaction });
          message = "Like Added";
        }
        await type.save({ transaction });
        return {
          statusCode: 201,
          message,
        };
      });
    } catch (err) {
      throw err;
    }
  },

  getLikesService: async (typeId, likeType) => {
    try {
      const likeList = await Likes.findAll({
        where: { typeId, likeType },
        attributes: ["userId"],
      });

      return {
        statusCode: 200,
        name: "likeList",
        value: likeList,
      };
    } catch (err) {
      throw err;
    }
  },
};
