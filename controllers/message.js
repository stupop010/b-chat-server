const models = require("../models");

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
    console.error(error);
  }
};

const createPin = async (req, res, next) => {
  const { messageId, channelId } = req.body.data;
  console.log(messageId, channelId);
};

module.exports = {
  editMessage,
  createPin
};
