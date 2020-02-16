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
    console.log(msg);
    res.json(msg);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  editMessage
};
