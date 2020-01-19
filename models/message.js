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
    channelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Message;
};
