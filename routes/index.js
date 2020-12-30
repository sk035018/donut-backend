const express = require("express");

const {
  cors,
  json,
  logger,
  passport,
  urlencoded,
  authenticate,
} = require("../middlewares");

const {
  newPost,
  myPosts,
  updateDP,
  allPosts,
  myProfile,
  loginUser,
  addComment,
  signUpUser,
  destroyPost,
  destroyUser,
  uploadMedia,
  googleSignUp,
  updateComment,
  updateProfile,
  updatePassword,
  destroyComment,
  uploadProfilePic,
} = require("../controllers");

const {
  result,
  postValidations,
  signUpValidation,
  commentValidations,
  profileUpdateValidations,
  updatePasswordValidations,
} = require("../validator");

const router = express.Router();

// MiddleWares
router.use(cors);
router.use(passport);
router.use(logger);
router.use(json);
router.use(urlencoded);

// Users EndPoints
router.get("/myprofile", authenticate, myProfile);
router.post("/signup", signUpValidation, result, signUpUser);
router.post(
  "/google_signup",
  googleSignUp,
  signUpValidation,
  result,
  signUpUser
);
router.post("/login", loginUser);
router.put("/update_display_profile", authenticate, uploadProfilePic, updateDP);
router.put(
  "/update_passsword",
  authenticate,
  updatePasswordValidations,
  result,
  updatePassword
);
router.put(
  "/update_profile",
  authenticate,
  profileUpdateValidations,
  result,
  uploadProfilePic,
  updateProfile
);
router.delete("/user", authenticate, destroyUser);

// Posts Endpoints
router.get("/posts/all", authenticate, allPosts);
router.get("/my_posts", authenticate, myPosts);
router.post(
  "/posts/create",
  authenticate,
  uploadMedia,
  postValidations,
  result,
  newPost
);
router.delete("/post/:id", authenticate, destroyPost);

// Comments Endpoints
router.post(
  "/posts/comment/create",
  authenticate,
  commentValidations,
  result,
  addComment
);
router.put(
  "/posts/comment/update",
  authenticate,
  commentValidations,
  result,
  updateComment
);
router.delete("/posts/comment/:id", authenticate, destroyComment);

module.exports = { router, express };
