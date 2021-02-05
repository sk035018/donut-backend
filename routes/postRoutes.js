const {
  allPosts,
  destroyPost,
  editPost,
  friendsPosts,
  getPost,
  myPosts,
  newPost,
  userPosts,
  uploadMedia,
} = require("../controllers");

const { postValidations, result } = require("../validator");

module.exports = (router, authenticate) => {
  router.get("/friends_posts", authenticate, friendsPosts);
  router.get("/all_posts", authenticate, allPosts);
  router.get("/user_posts/:id", authenticate, userPosts);
  router.get("/my_posts", authenticate, myPosts);
  router.get("/get_post/:postId", authenticate, getPost);

  router.post(
    "/create_post",
    authenticate,
    uploadMedia,
    postValidations,
    result,
    newPost
  );

  router.put(
    "/edit_post",
    authenticate,
    uploadMedia,
    postValidations,
    result,
    editPost
  );

  router.delete("/post/:id", authenticate, destroyPost);
};
