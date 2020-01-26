const { Sequelize } = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(
  `mysql://${config.dbUser}:${config.dbPass}@localhost:3306/slack`
);

const models = {
  Channel: sequelize.import("./channel"),
  Project: sequelize.import("./project"),
  Revoked_token: sequelize.import("./revokedToken"),
  User: sequelize.import("./users"),
  ProjectMember: sequelize.import("./projectMember"),
  Message: sequelize.import("./message"),
  ChannelMember: sequelize.import("./channelMember")
};

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
