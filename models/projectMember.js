module.exports = (sequelize, DataTypes) => {
  const ProjectMember = sequelize.define("project_members", {
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return ProjectMember;
};
