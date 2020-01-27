module.exports = (sequelize, DataTypes) => {
  const ChannelMember = sequelize.define("channel_members", {
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return ChannelMember;
};
