const { Users } = require("../models");
const isOnline = {};
const connection = (server) => {
  const users = {};

  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
    },
  });

  io.on("connect", (socket) => {
    try {
      let userId;
      socket.on("userId", (id) => {
        users[id] = socket.id;
        isOnline[id] = true;
        userId = id;
        console.log(users);
        require("./messages")(io, socket, isOnline, userId, users);
        require("./notifications")(io, socket, isOnline, userId, users);
      });

      socket.on("disconnect", async () => {
        try {
          isOnline[userId] = false;
          users[userId] = null;
          await Users.update(
            { activeAt: Date.now() },
            { where: { id: userId } }
          );
          console.log(users);
        } catch (err) {
          console.log(err);
          throw err;
        }
      });
    } catch (err) {
      socket.emit("socketError", err.message);
    }
  });
};

module.exports.isOnline = isOnline;
module.exports.connection = connection;
