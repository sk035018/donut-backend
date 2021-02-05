const { sendMessageService } = require("../services");

module.exports = (io, socket, isOnline, userId, users) => {
  socket.on("newMessage", async ({ to, message }) => {
    try {
      if (isOnline[to]) {
        const newMessage = await sendMessageService(userId, {
          reciever: to,
          message,
        });
        io.to(users[to]).emit("recieveMessage", newMessage);
      } else {
        await sendMessageService(userId, {
          reciever: to,
          message,
          delivered: false,
        });
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  });
};
