module.exports = sequelize => {
  const PinnedMessages = sequelize.define("pinned_messages", {});

  return PinnedMessages;
};
