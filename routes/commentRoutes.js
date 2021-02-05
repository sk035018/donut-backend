const {
  addComment,
  destroyComment,
  postComments,
  updateComment,
} = require("../controllers");

const { commentValidations, result } = require("../validator");

module.exports = (router, authenticate) => {
  router.get("/all_comments/:id", authenticate, postComments);

  router.post(
    "/add_comment",
    authenticate,
    commentValidations,
    result,
    addComment
  );

  router.put(
    "/update_comment",
    authenticate,
    commentValidations,
    result,
    updateComment
  );

  router.delete("/comment/:id", authenticate, destroyComment);
};
