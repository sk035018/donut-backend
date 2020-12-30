const { newPostService, destroyPostService, myPostsService, allPostsService } = require("../services");
const { sendFailureResponse, response } = require("../utils");

module.exports = {
  allPosts: async (_, res) => {
    try {
      const responseData = await allPostsService();      
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

  myPosts: async (req, res) => {
    try {
      const responseData = await myPostsService(req.user.id);      
      response({ res, ...responseData });
    } catch (error) {
      console.log(err);
      sendFailureResponse({
        res,
        message: [err.message],
        statusCode: 500,
      });
    }
  },

  newPost: async (req, res) => {
    try {
      const responseData = await newPostService(req.user.id, req.body);
      response({ res, ...responseData });
    } catch (err) {
      console.error(err);
      sendFailureResponse({
        res,
        message: [err.message],
        statusCode: 500,
      });
    }
  },

  destroyPost: async (req, res) => {
    try {
      const responseData = await destroyPostService(req.user.id, req.params.id);
      response({ res, ...responseData });
    } catch (err) {
      console.error(err);
      sendFailureResponse({
        res,
        message: [err.message],
        statusCode: 500,
      });
    }
  },
};