module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define("channel", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });

  Channel.associate = models => {
    //   1:M
    Channel.belongsTo(models.Project);
    Channel.belongsToMany(models.User, {
      through: "channel_member",
      foreignKey: "channelId"
    });
    Channel.hasMany(models.Message);
  };

  return Channel;
};
