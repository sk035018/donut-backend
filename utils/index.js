const jwt = require("jsonwebtoken");
const passwords = require("random-passwords-generator");
const mailer = require("nodemailer");
const fs = require("fs");
const promisify = require("util").promisify;

passwordOptions = {
  LENGTH: 6,
  ALLOW_ALPHABETS_LOWERCASE: true,
  ALLOW_ALPHABETS_UPPERCASE: true,
  ALLOW_NUMBERS: true,
  ALLOW_SPECIAL_CHARACTERS: true,
  EXCEPTIONS: "!%'()+,-./:*;<=>?[]^_`{|}~",
  FIRST_CHARACTER_LOWERCASE: true,
  FIRST_CHARACTER_UPPERCASE: false,
  FIRST_CHARACTER_NUMBER: false,
  FIRST_CHARACTER_SPECIAL_CHARACTER: false,
  MIN_ALPHABETS_LOWERCASE: 1,
  MIN_ALPHABETS_UPPERCASE: 1,
  MIN_NUMBERS: 1,
  MIN_SPECIAL_CHARACTERS: 1,
};

const transporter = mailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendSuccessResponse = ({ res, data = {}, message, statusCode }) => {
  if (message) {
    data.message = message;
  }

  return res.status(statusCode).json(data);
};

const sendFailureResponse = ({
  res,
  message,
  statusCode = 500,
  errors = [],
}) => {
  const response = {
    errors: errors.length ? errors : [message],
  };

  return res.status(statusCode).json(response);
};

module.exports = {
  response: ({ message, statusCode, errors, name, value, res }) => {
    if (100 <= statusCode >= 400) {
      sendFailureResponse({ res, message, statusCode, errors });
    } else {
      sendSuccessResponse({
        res,
        data: { [name]: value },
        message,
        statusCode,
      });
    }
  },

  generateJwt: (payload, expiresIn = "1d") => {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
  },

  generatePassword: () => {
    return passwords(passwordOptions);
  },

  sendMail: async (data) => {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      ...data,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Mail Sent : ", info.response);
    } catch (err) {
      throw err;
    }
  },

  toPascalCase: (string) => {
    return string
      .trim()
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
      .join(" ");
  },

  stringifyMe: (obj) => JSON.parse(JSON.stringify(obj)),

  jwt,
  deleteFile: promisify(fs.unlink),
  sendFailureResponse,
};
