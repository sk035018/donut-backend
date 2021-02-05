const {
  sendFrndReqService,
  acceptFrndReqService,
  rejectFrndReqService,
  pendingFrndReqService,
  myFriendsService,
  unfriendService,
  friendSuggestionService,
} = require("../services");

const { sendFailureResponse, response } = require("../utils");

module.exports = {
  sendFrndReq: async (req, res) => {
    try {
      const responseData = await sendFrndReqService(
        req.user.id,
        +req.params.id
      );
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  acceptFrndReq: async (req, res) => {
    try {
      const responseData = await acceptFrndReqService(
        req.params.id,
        req.user.id
      );
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  rejectFrndReq: async (req, res) => {
    try {
      const responseData = await rejectFrndReqService(
        req.user.id,
        req.params.id
      );
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  pendingFrndReq: async (req, res) => {
    try {
      const responseData = await pendingFrndReqService(req.user.id);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  myFriends: async (req, res) => {
    try {
      const responseData = await myFriendsService(req.user.id);
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  unfriend: async (req, res) => {
    try {
      const responseData = await unfriendService(req.user.id, req.params.id);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  friendSuggestion: async (req, res) => {
    try {
      const responseData = await friendSuggestionService(req.user.id);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },
};
