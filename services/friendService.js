const {
  Friends,
  Sequelize,
  transaction,
  Users,
  Notifications,
} = require("../models");
const { friendList } = require("./utils");
const { isOnline } = require("../socket");
const { stringifyMe } = require("../utils");

module.exports = {
  sendFrndReqService: async (user1, user2) => {
    try {
      if (user1 === user2) {
        return {
          statusCode: 409,
          message: "Cannot Send Friend Request.",
        };
      }
      const existingEntry = await Friends.findOne({
        where: Sequelize.or({ user1, user2 }, { user1: user2, user2: user1 }),
      });

      if (!existingEntry) {
        await Friends.create({ user1, user2 });
        return {
          statusCode: 201,
          message: "Friend Request Sent !!!",
        };
      } else {
        return {
          statusCode: 409,
          message: "Friend Request Already Sent !!!",
        };
      }
    } catch (err) {
      throw err;
    }
  },

  acceptFrndReqService: async (user1, user2) => {
    try {
      return transaction(async (transaction) => {
        await Friends.update(
          { accepted: true },
          { where: { user1, user2 } },
          { transaction }
        );

        await Users.increment(
          { total_friends: 1 },
          { where: { id: [user1, user2] } },
          { transaction }
        );

        return {
          statusCode: 200,
          message: "Friend Request Accepted !!!",
        };
      });
    } catch (err) {
      throw err;
    }
  },

  rejectFrndReqService: async (user1, user2) => {
    try {
      await Friends.destroy({
        where: Sequelize.or({ user1, user2 }, { user1: user2, user2: user1 }),
      });
      return {
        statusCode: 200,
        message: "Friend Request Rejected !!!",
      };
    } catch (err) {
      throw err;
    }
  },

  pendingFrndReqService: async (id) => {
    try {
      const pendingReqList = await Friends.findAll({
        where: { user2: id, accepted: false },
        include: {
          model: Users,
          attributes: ["id", "fullName", "userName", "profilePic"],
        },
        attributes: ["id"],
      });
      return {
        statusCode: 200,
        name: "pendingReqList",
        value: pendingReqList,
      };
    } catch (err) {
      throw err;
    }
  },

  myFriendsService: async (id) => {
    try {
      const myFriends = {};
      const list = await friendList(id);

      const friendDetail = await Users.findAll({
        where: { id: list },
        attributes: { exclude: ["password"] },
      });

      friendDetail.forEach((_friend) => {
        const friend = stringifyMe(_friend);
        friend.isOnline = isOnline[friend.id];
        myFriends[friend.id] = friend;
      });

      return {
        statusCode: 200,
        name: "myFriends",
        value: myFriends,
      };
    } catch (err) {
      throw err;
    }
  },

  unfriendService: async (user1, user2) => {
    try {
      return transaction(async (transaction) => {
        await Friends.destroy(
          {
            where: {
              ...Sequelize.or({ user1, user2 }, { user1: user2, user2: user1 }),
              accepted: true,
            },
          },
          { transaction }
        );

        await Notifications.destroy(
          {
            where: Sequelize.or(
              { from: user1, to: user2 },
              { from: user2, to: user1 }
            ),
          },
          { transaction }
        );

        await Users.decrement(
          { total_friends: 1 },
          { where: { id: [user1, user2] } },
          { transaction }
        );

        return {
          statusCode: 200,
          message: "Friend removed successfully !!!",
        };
      });
    } catch (err) {
      throw err;
    }
  },

  friendSuggestionService: async (id) => {
    try {
      const friends = await friendList(id);
      const friendsOfFriends = [];
      for (let i = 0; i < friends.length; i++) {
        const spread = await friendList(friends[i]);
        friendsOfFriends.push(...spread);
      }

      const friendsWithMutuals = {};
      for (let i = 0; i < friendsOfFriends.length; i++) {
        const uId = friendsOfFriends[i];
        if (uId !== id) {
          friendsWithMutuals[uId] = friendsWithMutuals[uId]
            ? friendsWithMutuals[uId] + 1
            : 1;
        }
      }
      const suggestedIds = Object.keys(friendsWithMutuals)
        .map((el) => ({
          key: el,
          value: friendsWithMutuals[el],
        }))
        .sort(({ value: v1 }, { value: v2 }) => v2 - v1)
        .map(({ key }) => key);

      const suggestions = await Users.findAll({
        where: { id: suggestedIds },
        attributes: ["id", "fullName", "profilePic"],
      });
      return {
        statusCode: 200,
        name: "suggestions",
        value: suggestions,
      };
    } catch (err) {
      console.log(err);
    }
  },
};
