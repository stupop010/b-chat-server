const models = require("../models");

const fetchChannel = async (req, res) => {
  try {
    const uuid = req.query.uuid;

    const response = await models.sequelize.transaction(async transaction => {
      const user = await models.User.findOne(
        {
          where: { id: req.user.id },
          include: [
            {
              model: models.Channel
            }
          ]
        },
        { transaction }
      );
      const messages = await models.Message.findAll(
        {
          where: { channelUUID: uuid }
        },
        { transaction }
      );

      const userData = user.get();
      const channels = userData.channels.map(channel => channel.dataValues);
      const channel = channels.filter(channel => channel.uuid === uuid)[0];

      return { channel, messages };
    });
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

const createChannel = async (req, res) => {
  try {
    const { name, description, private, projectId } = req.body;
    const userId = req.user.id;
    await models.sequelize.transaction(async transaction => {
      const channel = await models.Channel.create(
        {
          name,
          description,
          private,

          projectId
        },
        { transaction }
      );
      await models.ChannelMember.create(
        {
          channelId: channel.id,
          userId,
          admin: true
        },
        { transaction }
      );
    });

    const user = await models.User.findOne({
      where: { id: req.user.id },
      include: [{ model: models.Project, include: [{ model: models.Channel }] }]
    });

    const projects = user.getDataValue("projects");
    res.json(projects);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

const deleteChannel = async (req, res) => {
  try {
    const channelId = Number(req.query.data);

    await models.Channel.destroy({
      where: { id: channelId }
    });

    // const user = await models.User.findOne({
    //   where: { id: req.user.id },
    //   include: [{ model: models.Project, include: [{ model: models.Channel }] }]
    // });

    // const projects = user.getDataValue("projects");
    res.json({ message: "okay" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

module.exports = {
  deleteChannel,
  createChannel,
  fetchChannel
};
