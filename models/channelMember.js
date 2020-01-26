module.exports = (sequelize, DataTypes) => {
  const ChannelMember = sequelize.define("channel_members", {});

  return ChannelMember;
};
