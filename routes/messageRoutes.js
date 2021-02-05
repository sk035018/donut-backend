const {
  deleteChat,
  deleteMessage,
  getMessages,
  pendingMessages,
  sendMessage,
} = require("../controllers");

module.exports = (router, authenticate) => {
  router.get("/get_message/:id", authenticate, getMessages);
  router.get("/pending_messages", authenticate, pendingMessages);

  router.post("/send_message", authenticate, sendMessage);

  router.delete("/delete_message/:id", authenticate, deleteMessage);
  router.delete("/delete_chat/:id", authenticate, deleteChat);
};
