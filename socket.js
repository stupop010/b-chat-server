const models = require("./models");

module.exports = socket = io => {
  io.on("connection", socket => {
    console.log("connect");

    socket.on("message", async data => {
      const { message, channelUUID, userId, userName, channelId } = data;
      const msg = await models.Message.create({
        message,
        channelUUID,
        userId,
        userName,
        channelId
      });

      io.sockets
        .in(channelUUID)
        .emit("newMessage", { message: msg.dataValues });
    });

    socket.on("fetch_messages", async ({ channelId, channelUUID }) => {
      try {
        const messages = await models.Message.findAll({
          where: {
            channelId
          }
        });
        io.sockets
          .in(channelUUID)
          .emit("fetched_messages", { messages, channelId });
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("join", ({ channel }, cb) => {
      const { uuid, name } = channel;
      socket.join(uuid);

      io.in(uuid).emit("onlineInChannel", {
        // online: socket.adapter.rooms[id]
      });
      cb(`Joined channel ${name} id: ${uuid}`);
    });

    socket.on("join_project", ({ project }, cb) => {
      const { id, name } = project;
      socket.join(id);
      cb(`Joined project ${name} id: ${id}`);
    });

    socket.on("fetch_project_data", async ({ projectId }) => {
      const projects = await models.Project.findOne({
        where: { id: projectId },
        include: models.Channel
      });
      console.log(projects);
      io.in(projectId).emit("send_project_data", { projects });
    });

    socket.on("disconnect", () => {
      console.log("User left");
    });
  });
};
