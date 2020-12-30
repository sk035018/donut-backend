const multer = require("multer");
const path = require("path");
const { imageFilter, mediaFilter } = require("../validator");
const { fs, sendFailureResponse } = require("../utils");

const profilePicStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    const _path = "./uploads/profile";
    fs.mkdirSync(_path, { recursive: true });
    cb(null, _path);
  },

  filename: (req, file, cb) => {
    cb(null, `DP_${req.user.userName}${path.extname(file.originalname)}`);
  },
});

const postStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    const _path = "./uploads/posts";
    fs.mkdirSync(_path, { recursive: true });
    cb(null, _path);
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
        console.error(err);
        sendFailureResponse({
          res,
          message: [err.message],
          statusCode: 500,
        });
      } else {
        if (req.file) {
          const profilePic = req.file.path.replace(/\\/g, '/');
          req.body.profilePic = profilePic;
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
        console.error(err);
        sendFailureResponse({
          res,
          message: [error.message],
          statusCode: 500,
        });
      } else {
        if (req.file) {
          const media = req.file.path.replace(/\\/g, '/');
          req.body.media = media;
        }
        next();
      }
    });
  },
};
