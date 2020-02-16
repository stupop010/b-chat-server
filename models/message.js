module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    message: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER
    },
    userName: {
      type: DataTypes.STRING
    },
    channelUUID: {
      type: DataTypes.UUID,
      allowNull: false
    }
  });

  Message.associate = models => {
    //   1:M
    Message.belongsTo(models.Channel);
  };

  return Message;
};
