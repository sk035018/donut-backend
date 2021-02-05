const { sharePost } = require("../controllers");

module.exports = (router, authenticate) => {
  router.post("/share_post/:postId", authenticate, sharePost);
};
