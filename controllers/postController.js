const {
  newPostService,
  destroyPostService,
  myPostsService,
  allPostsService,
  friendsPostsService,
  editPostService,
  getPostService,
} = require("../services");
const { sendFailureResponse, response } = require("../utils");

module.exports = {
  allPosts: async (_, res) => {
    try {
      const responseData = await allPostsService();
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  myPosts: async (req, res) => {
    try {
      const responseData = await myPostsService(req.user.id);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  newPost: async (req, res) => {
    try {
      const responseData = await newPostService(req.user.id, req.body);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  destroyPost: async (req, res) => {
    try {
      const responseData = await destroyPostService(req.user.id, req.params.id);
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  friendsPosts: async (req, res) => {
    try {
      const responseData = await friendsPostsService(req.user.id);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  userPosts: async (req, res) => {
    try {
      const responseData = await myPostsService(req.params.id);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  editPost: async (req, res) => {
    try {
      const responseData = await editPostService(req.user.id, req.body);
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  getPost: async (req, res) => {
    try {
      const responseData = await getPostService(req.user.id, req.params.postId);
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
      sendFailureResponse({
        res,
        messsage: err.message,
      });
    }
  },
};
