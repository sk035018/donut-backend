const {
  sendMessageService,
  deleteMessageService,
  getMessageService,
  deleteChatService,
  pendingMessagesService,
} = require("../services");
const { sendFailureResponse, response } = require("../utils");

module.exports = {
  sendMessage: async (req, res) => {
    try {
      const responseData = await sendMessageService(req.user.id, req.body);
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const responseData = await deleteMessageService(
        req.user.id,
        req.params.id
      );
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  getMessages: async (req, res) => {
    try {
      const responseData = await getMessageService(req.user.id, req.params.id);
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  deleteChat: async (req, res) => {
    try {
      const responseData = await deleteChatService(req.user.id, req.params.id);
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
    }
  },

  pendingMessages: async (req, res) => {
    try {
      const responseData = await pendingMessagesService(req.user.id);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },
};
