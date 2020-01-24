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
  ChannelMember: sequelize.import("./channelMember"),
  Message: sequelize.import("./message")
  // Star: sequelize.import("./star")
};

Object.keys(models).forEach(modelName => {
  console.log(modelName);
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
