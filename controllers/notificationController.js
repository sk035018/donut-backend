const { pendingNotificationService } = require("../services");
const { sendFailureResponse, response } = require("../utils");

module.exports = {
  pendingNotification: async (req, res) => {
    try {
      const responseData = await pendingNotificationService(req.user.id);
      response({ res, ...responseData });
    } catch (err) {
      sendFailureResponse({
        res,
        message: err.message,
      });
    }
  },
};
