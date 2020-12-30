const {
  updateDPService,
  loginUserService,
  signUpUserService,
  destroyUserService,
  updateProfileService,
  updatePasswordService,
} = require("../services/userService");

const { sendFailureResponse, response, generatePassword } = require("../utils");

module.exports = {
  signUpUser: async ({ body }, res) => {
    try {
      const responseData = await signUpUserService(body);
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

  loginUser: async (req, res) => {
    try {
      const responseData = await loginUserService(req.body);
      response({ res, ...responseData });
    } catch (err) {
      console.error(err);
      sendFailureResponse({
        res,
        message: [error.message],
        statusCode: 500,
      });
    }
  },

  myProfile: async (req, res) => {
    res.send(req.user);
  },

  updateDP: async (req, res) => {
    try {
      const responseData = await updateDPService(req.user.id, req.body.profilePic);
      response({ res, ...responseData });
    } catch (err) {
      console.error(err);
      sendFailureResponse({
        res,
        message: [error.message],
        statusCode: 500,
      });
    }
  },

  destroyUser: async (req, res) => {
    try {
      const responseData = await destroyUserService(req.user.id, req.body.password);
      response({ res, ...responseData });
    } catch (err) {
      console.error(err);
      sendFailureResponse({
        res,
        message: [error.message],
        statusCode: 500,
      });
    }
  },

  googleSignUp: async (req, res, next) => {
    try {
      const { email } = req.body;
      req.body = {
        ...req.body,
        userName: email.substring(0, email.indexOf('@')),
        password: generatePassword(),
      }
      next();
    } catch(error) {
      console.log(error);
      sendFailureResponse({
        res,
        message: [error.message],
        statusCode: 500,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const responseData = await updateProfileService(req.user.id, req.body);
      response({ res, ...responseData});
    } catch(error) {
      console.log(error);
      sendFailureResponse({
        res,
        message: [error.message],
        statusCode: 500,
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const responseData = await updatePasswordService(req.user.id, req.body);
      response({ res, ...responseData });
    } catch(error) {
      console.log(error);
      sendFailureResponse({
        res,
        message: [error.message],
        statusCode: 500,
      });
    }
  },
};
