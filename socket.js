const models = require("./models");

module.exports = socket = io => {
  io.on("connection", socket => {
    console.log("connect");

    socket.on("message", async data => {
      const { message, channelId, userId, userName } = data;
      const msg = await models.Message.create({
        message,
        channelId,
        userId,
        userName
      });
      console.log(socket.adapter.rooms[channelId], "hello");
      console.log(msg.dataValues);
      console.log(socket.to());
      io.sockets.in(channelId).emit("newMessage", { message: msg.dataValues });
    });

    socket.on("join", ({ channel }, cb) => {
      const { id, name } = channel;
      socket.join(id);
      console.log(id);
      io.to(id).emit("onlineInChannel", {
        online: socket.adapter.rooms[id]
      });
      cb(`Joined channel ${name} id:${id}`);
    });

    socket.on("disconnect", () => {
      console.log("User left");
    });
  });
};
