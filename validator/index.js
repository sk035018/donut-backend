const {
  body,
  checkExisting,
  validateIsEmpty,
  validateNotEmpty,
  validationResult,
  passwordValidations,
} = require("./utility");

const { sendFailureResponse } = require("../utils");

const signUpValidation = [
  ...validateNotEmpty(["fullName", "userName", "email", "password"]),

  body("userName").custom(async (userName) => {
    const existingUser = await checkExisting(null, userName);
    if (existingUser) throw new Error("UserName not available");
    else if (userName.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/))
      throw new Error("Username Cannot have special character");
    else return true;
  }),

  body("email").isEmail().withMessage("Email is not valid"),

  body("email").custom(async (email) => {
    const existingUser = await checkExisting(email);
    if (existingUser) throw new Error("Email already Registered");
    else return true;
  }),

  ...passwordValidations("password"),
];

const postValidations = [
  body().custom(({ text, media }) => {
    if (!text && !media) throw new Error("Either Text or Media Required");
    else return true;
  }),
];

const profileUpdateValidations = [
  ...validateIsEmpty(["userName", "email", "password"]),
];

const updatePasswordValidations = [...passwordValidations("newPassword")];

const result = (req, res, next) => {
  const errors = validationResult(req).formatWith(
    ({ msg }) => `Error ==> ${msg}`
  );

  if (!errors.isEmpty()) {
    sendFailureResponse({
      res,
      statusCode: 406,
      errors: errors.array(),
      message: "Request Failed !!!",
    });
  } else next();
};

const commentValidations = [
  body('message').notEmpty().withMessage('comment can not be empty.')
];

module.exports = {
  result,
  postValidations,
  signUpValidation,
  commentValidations,
  profileUpdateValidations,
  updatePasswordValidations,
  ...require("./multerValidators"),
};