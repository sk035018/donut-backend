const { Likes, Friends, Sequelize } = require("../models");

module.exports = {
  friendList: async (id) => {
    try {
      const userFriends = await Friends.findAll({
        where: {
          ...Sequelize.or({ user1: id }, { user2: id }),
          accepted: true,
        },
        attributes: ["user1", "user2"],
      });

      return userFriends.map(({ user1, user2 }) =>
        user1 === id ? user2 : user1
      );
    } catch (err) {
      throw err;
    }
  },

  likeCheck: async (typeArray, likeType, userId) => {
    try {
      for (let i = 0; i < typeArray.length; ++i) {
        const isLiked = await Likes.findOne({
          where: {
            userId,
            likeType,
            typeId: typeArray[i].id,
          },
        });
        typeArray[i].isLiked = Boolean(isLiked);
      }
      return typeArray;
    } catch (err) {
      throw err;
    }
  },
};
