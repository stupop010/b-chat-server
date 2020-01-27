const models = require("../models");

const createChannel = async (req, res) => {
  try {
    const { name, description, private, projectId, userId } = req.body;

    await models.Channel.create({
      name,
      description,
      private,
      projectId
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

module.exports = {
  deleteChannel,
  createChannel
};
