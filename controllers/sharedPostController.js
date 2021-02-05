const { response, sendFailureResponse } = require("../utils");
const { sharePostService } = require("../services");

module.exports = {
  sharePost: async (req, res) => {
    try {
      const responseData = await sharePostService(
        req.user.id,
        req.params.postId
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
