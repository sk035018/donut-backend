const multer = require("multer");
const path = require("path");
const { imageFilter, mediaFilter } = require("../validator");
const { sendFailureResponse } = require("../utils");

const profilePicStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, process.env.DP_FILE_PATH);
  },

  filename: (req, file, cb) => {
    cb(null, `DP_${req.user.userName}${path.extname(file.originalname)}`);
  },
});

const postStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, process.env.POSTS_FILE_PATH);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `POST_${req.user.userName}_${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

module.exports = {
  uploadProfilePic: (req, res, next) => {
    const upload = multer({
      storage: profilePicStorage,
      fileFilter: imageFilter,
    }).single("profilePic");
    upload(req, res, (err) => {
      if (err) {
        sendFailureResponse({
          res,
          message: err.message,
        });
      } else {
        if (req.file) {
          req.body.profilePic = "/" + req.file.filename;
        }
        next();
      }
    });
  },

  uploadMedia: (req, res, next) => {
    const upload = multer({
      storage: postStorage,
      fileFilter: mediaFilter,
    }).single("media");
    upload(req, res, (err) => {
      if (err) {
        sendFailureResponse({
          res,
          message: err.message,
        });
      } else {
        if (req.file) {
          req.body.media = "/" + req.file.filename;
        }
        next();
      }
    });
  },
};
