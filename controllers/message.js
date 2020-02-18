const models = require("../models");

const fetchPinnedMessage = async (req, res, next) => {
  const { channelId } = req.query;
  try {
    const messages = await models.Channel.findOne({
      where: {
        id: channelId
      },
      include: [{ model: models.Message }]
    });
    res.json(messages);
  } catch (error) {
    next(error);
    console.error(error);
  }
};

const editMessage = async (req, res, next) => {
  const { message, messageId } = req.body;
  try {
    const msg = await models.Message.findOne({
      where: {
        id: messageId
      }
    });

    msg.update({
      message
    });

    res.json(msg);
  } catch (error) {
    next(error);
    console.error(error);
  }
};

const createPin = async (req, res, next) => {
  const { messageId, channelId } = req.body.data;
  try {
    const message = await models.PinnedMessages.findOne({ where: messageId });

    if (message)
      return res
        .status(422)
        .json({ errors: [{ msg: "Message already Pinned" }] });

    const pinnedMessage = await models.PinnedMessages.create({
      messageId,
      channelId
    });

    res.json(pinnedMessage);
  } catch (error) {
    next(error);
    console.error(error);
  }
};

module.exports = {
  fetchPinnedMessage,
  editMessage,
  createPin
};
