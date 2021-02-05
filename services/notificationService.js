const { Notifications } = require("../models");

module.exports = {
  pendingNotificationService: async (to) => {
    try {
      const notificationList = await Notifications.findAll({
        where: { to, delivered: false },
      });

      return {
        statusCode: 200,
        name: "notificationList",
        value: notificationList,
      };
    } catch (err) {
      throw err;
    }
  },

  createNotificationService: async (_notification) => {
    try {
      const notification = await Notifications.create(_notification);
      const { from, type, typeId, headLine } = stringifyMe(notification);
      return { from, type, typeId, headLine };
    } catch (err) {
      throw err;
    }
  },
};
