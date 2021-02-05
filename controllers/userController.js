const {
  loginUserService,
  signUpUserService,
  searchUserService,
  userProfileService,
  destroyUserService,
  loginGoogleService,
  updateProfileService,
  resetPasswordService,
  forgotPasswordService,
  updatePasswordService,
} = require("../services");

const { sendFailureResponse, response } = require("../utils");
const verify = require("../Auth");

module.exports = {
  signUpUser: async ({ body }, res) => {
    try {
      const responseData = await signUpUserService(body);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const responseData = await loginUserService(req.body);
      response({ res, ...responseData });
    } catch (err) {
      console.log(err);
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const responseData = await forgotPasswordService(req.body.email);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const responseData = await resetPasswordService(
        req.user.id,
        req.body.newPassword
      );
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  loginGoogle: async (req, res) => {
    try {
      const payload = await verify(req.body.token);
      const responseData = await loginGoogleService(
        payload,
        req.body.expiresIn
      );
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  myProfile: async (req, res) => {
    res.send(req.user);
  },

  updateDP: async (req, res) => {
    try {
      const responseData = await updateDPService(
        req.user.id,
        req.body.profilePic
      );
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  destroyUser: async (req, res) => {
    try {
      const responseData = await destroyUserService(
        req.user.id,
        req.body.password
      );
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const responseData = await updateProfileService(req.user.id, req.body);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const responseData = await updatePasswordService(req.user.id, req.body);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  searchUser: async (req, res) => {
    try {
      const responseData = await searchUserService(
        req.user.id,
        req.params.name
      );
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },

  userProfile: async (req, res) => {
    try {
      const responseData = await userProfileService(req.params.id);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },
};
