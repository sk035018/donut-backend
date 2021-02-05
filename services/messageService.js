const { Messages, Friends, Sequelize, transaction } = require("../models");
const { stringifyMe } = require("../utils");

module.exports = {
  sendMessageService: async (sender, { reciever, ...rest }) => {
    try {
      if (!rest.message) {
        return {
          statusCode: 406,
          message: "Message can not be empty",
        };
      }
      const connection = await Friends.findOne({
        where: {
          ...Sequelize.or(
            { user1: sender, user2: reciever },
            { user1: reciever, user2: sender }
          ),
          accepted: true,
        },
      });
      if (!connection) {
        return {
          statusCode: 401,
          message: "You both are not Friends",
        };
      }
      const { id, created_at, message } = await Messages.create({
        sender,
        reciever,
        ...rest,
      });
      if (id) {
        return { id, created_at, message, statusCode: 200 };
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  deleteMessageService: async (id, messageId) => {
    try {
      const checkmessage = await Messages.findOne({ where: { id: messageId } });
      if (!checkmessage) {
        return {
          statusCode: 404,
          message: "This message does not exists.",
        };
      }
      if (checkmessage.sender !== id) {
        return {
          statusCode: 401,
          message: "This message doesn't belongs to You.",
        };
      }
      const deleted = Messages.destroy({ where: { id: messageId } });
      if (deleted) {
        return {
          statusCode: 200,
          message: "Message Deleted.",
        };
      }
    } catch (err) {
      throw err;
    }
  },

  getMessageService: async (sender, reciever) => {
    try {
      const checkFriend = await Friends.findOne({
        where: {
          ...Sequelize.or(
            { user1: sender, user2: reciever },
            { user1: reciever, user2: sender }
          ),
          accepted: true,
        },
      });
      if (!checkFriend) {
        return {
          statusCode: 401,
          message: "You both are not Friends.",
        };
      }
      const messageList = await Messages.findAll({
        where: {
          ...Sequelize.or(
            { sender, reciever },
            { sender: reciever, reciever: sender }
          ),
          showTo: [0, sender],
        },
        order: [["created_at", "ASC"]],
      });
      Messages.update(
        { delivered: true },
        {
          where: {
            ...Sequelize.or(
              { sender, reciever },
              { sender: reciever, reciever: sender }
            ),
            delivered: false,
          },
        }
      );
      return {
        statusCode: 200,
        name: "messageList",
        value: messageList,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  deleteChatService: async (sender, reciever) => {
    try {
      return transaction(async (transaction) => {
        await Messages.update(
          { showTo: reciever },
          {
            where: {
              ...Sequelize.or(
                { sender, reciever },
                { sender: reciever, reciever: sender }
              ),
              showTo: 0,
            },
          },
          { transaction }
        );

        await Messages.destroy(
          {
            where: {
              ...Sequelize.or(
                { sender, reciever },
                { sender: reciever, reciever: sender }
              ),
              showTo: sender,
            },
          },
          { transaction }
        );

        return {
          statusCode: 200,
          message: "Chat Deleted.",
        };
      });
    } catch (err) {
      throw err;
    }
  },

  pendingMessagesService: async (reciever) => {
    try {
      const _pendingMessages = await Messages.findAll({
        where: { reciever, delivered: false },
        attributes: ["sender"],
        order: [["created_at", "DESC"]],
      });

      const pendingMessages = [
        ...new Set(stringifyMe(_pendingMessages).map(({ sender }) => sender)),
      ];

      return {
        statusCode: 200,
        name: "messages",
        value: pendingMessages,
      };
    } catch (err) {
      throw err;
    }
  },
};
