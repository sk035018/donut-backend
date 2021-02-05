const {
  acceptFrndReq,
  friendSuggestion,
  myFriends,
  pendingFrndReq,
  rejectFrndReq,
  sendFrndReq,
  unfriend,
} = require("../controllers");

module.exports = (router, authenticate) => {
  router.get("/pending_frnd_req", authenticate, pendingFrndReq);
  router.get("/friend_suggestion", authenticate, friendSuggestion);
  router.get("/my_friends", authenticate, myFriends);

  router.post("/frnd_request/send/:id", authenticate, sendFrndReq);

  router.put("/frnd_request/accept/:id", authenticate, acceptFrndReq);

  router.delete("/frnd_request/reject/:id", authenticate, rejectFrndReq);
  router.delete("/frnd_request/cancel/:id", authenticate, rejectFrndReq);
  router.delete("/unfriend/:id", authenticate, unfriend);
};
