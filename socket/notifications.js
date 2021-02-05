const { createNotificationService } = require("../services");

module.exports = (io, socket, isOnline, userId, users) => {
  socket.on("likePost", async ({ postId, to }) => {
    try {
      const notification = {
        from: userId,
        to,
        type: "LIKEPOST",
        postId,
      };
      if (isOnline[to]) {
        const likePost = await createNotificationService(notification);
        io.to(users[to]).emit("likePost", likePost);
      } else {
        notification.delivered = false;
        await createNotificationService(notification);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("likeComment", async ({ postId, to }) => {
    try {
      const notification = {
        from: userId,
        to,
        type: "LIKECOMMENT",
        postId,
      };
      if (isOnline[to]) {
        const likeComment = await createNotificationService(notification);
        io.to(users[to]).emit("likeComment", likeComment);
      } else {
        notification.delivered = false;
        await createNotificationService(notification);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("commentPost", async ({ postId, to }) => {
    try {
      const notification = {
        from: userId,
        to,
        type: "comment",
        typeId: postId,
      };
      if (isOnline[to]) {
        const commentNotification = await createNotificationService(
          notification
        );
        io.to(users[to]).emit("commentNotification", commentNotification);
      } else {
        notification.delivered = false;
        await createNotificationService(notification);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
