module.exports = (sequelize, DataTypes) => {
  const ChannelMember = sequelize.define("channel_member", {
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return ChannelMember;
};
