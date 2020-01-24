module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    message: {
      type: DataTypes.STRING
    }
    // userId: {
    //   type: DataTypes.INTEGER
    // },
    // userName: {
    //   type: DataTypes.STRING
    // },
    // channelId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // }
  });

  Message.associate = models => {
    //   1:M
    Message.belongsTo(models.Channel);

    // Message.belongsTo(models.Message);
  };

  return Message;
};
