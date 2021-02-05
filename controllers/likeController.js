const { sendFailureResponse, response } = require("../utils/index.js");
const { operateLikeService, getLikesService } = require("../services");

module.exports = {
  operateLike: async (req, res) => {
    try {
      const urlName = req.url.substring(1, req.url.indexOf("/", 1));
      const likeType = urlName === "post" ? "POST" : "COMMENT";
      const responseData = await operateLikeService(
        req.user.id,
        +req.params.id,
        likeType
      );
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  getLikes: async (req, res) => {
    try {
      const urlName = req.url.substring(1, req.url.indexOf("/", 1));
      const likeType = urlName === "post" ? "POST" : "COMMENT";

      const responseData = await getLikesService(+req.params.id, likeType);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },
};
