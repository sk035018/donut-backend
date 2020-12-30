const {
  updateCommentService,
  addCommentService,
  destroyCommentService,
} = require("../services");

const { sendFailureResponse, response } = require("../utils");

module.exports = {
  addComment: async (req, res) => {
    try {
      const responseData = await addCommentService(req.user.id, req.body);
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
      sendFailureResponse({
        res,
        message: [err.message],
        statusCode: 500,
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
      console.log(err);
      sendFailureResponse({
        statusCode: 500,
        message: [err.message],
        res,
      });
    }
  },

  updateComment: async (req, res) => {
    try {
      const responseData = await updateCommentService(req.body);
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
      sendFailureResponse({
        res,
        message: [err.message],
        statusCode: 500,
      });
    }
  },
};
