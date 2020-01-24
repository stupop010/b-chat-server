module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  User.associate = models => {
    User.belongsToMany(models.Project, {
      through: "project_member",
      foreignKey: "userId"
    });
    User.belongsToMany(models.Channel, {
      through: "channel_member",
      foreignKey: "userId"
    });
    User.hasMany(models.Message);
  };

  return User;
};
