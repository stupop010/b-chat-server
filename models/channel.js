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
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    }
  });

  Channel.associate = models => {
    //   1:M
    Channel.belongsTo(models.Project);
    Channel.belongsToMany(models.User, {
      through: "channel_members",
      foreignKey: "channelId"
    });
    Channel.belongsToMany(models.Message, {
      through: "pinned_messages",
      foreignKey: "channelId"
    });
    Channel.hasMany(models.Message);
  };

  return Channel;
};
