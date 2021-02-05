const { pendingNotification } = require("../controllers");

module.exports = (router, authenticate) => {
  router.get("/pending_notification", authenticate, pendingNotification);
};
