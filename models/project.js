module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("projects", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  });

  Project.associate = models => {
    Project.belongsToMany(models.User, {
      through: "member",
      foreignKey: "projectId"
    });

    Project.hasMany(models.Channel);
  };

  return Project;
};
