const { getLikes, operateLike } = require("../controllers");

module.exports = (router, authenticate) => {
  router.get("/post/get_likes/:id", authenticate, getLikes);
  router.get("/comment/get_likes/:id", authenticate, getLikes);

  router.post("/post/like/:id", authenticate, operateLike);
  router.post("/comment/like/:id", authenticate, operateLike);
};
