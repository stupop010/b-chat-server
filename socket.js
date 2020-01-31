const models = require("./models");

module.exports = socket = io => {
  io.on("connection", socket => {
    console.log("connect");

    socket.on("message", async data => {
      const { message, channelUUID, userId, userName } = data;
      const msg = await models.Message.create({
        message,
        channelUUID,
        userId,
        userName
      });

      io.sockets.in(channelId).emit("newMessage", { message: msg.dataValues });
    });

    socket.on("join", ({ channel }, cb) => {
      const { id, name } = channel;
      socket.join(id);

      io.in(id).emit("onlineInChannel", {
        online: socket.adapter.rooms[id]
      });
      cb(`Joined channel ${name} id: ${id}`);
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
