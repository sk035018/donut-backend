const {
  updateCommentService,
  addCommentService,
  destroyCommentService,
  postCommentsService,
} = require("../services");

const { sendFailureResponse, response } = require("../utils");

module.exports = {
  addComment: async (req, res) => {
    try {
      const responseData = await addCommentService(req.user.id, req.body);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  destroyComment: async (req, res) => {
    try {
      const responseData = await destroyCommentService(
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

  updateComment: async (req, res) => {
    try {
      const responseData = await updateCommentService(req.user.id, req.body);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  postComments: async (req, res) => {
    try {
      const responseData = await postCommentsService(
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
};
