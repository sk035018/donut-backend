const express = require("express");

const {
  cors,
  json,
  logger,
  passport,
  urlencoded,
  trimFields,
  authenticate,
} = require("../middlewares");

const router = express.Router();

router.use(json);
router.use(cors);
router.use(logger);
router.use(passport);
router.use(urlencoded);
router.use(express.static(process.env.POSTS_FILE_PATH));
router.use(express.static(process.env.DP_FILE_PATH));

require("./commentRoutes")(router, authenticate);
require("./friendsRoutes")(router, authenticate);
require("./likeRoutes")(router, authenticate);
require("./messageRoutes")(router, authenticate);
require("./notificationRoutes")(router, authenticate);
require("./postRoutes")(router, authenticate);
require("./sharedPostRoutes")(router, authenticate);
require("./userRoutes")(router, authenticate, trimFields);

module.exports = { router, express };
