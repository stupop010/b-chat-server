const express = require("express");
const router = express.Router();

const models = require("../models");
const checkAuth = require("../middleware/checkAuth");

router.post("/", checkAuth, async (req, res) => {
  try {
    const { name, description, private, projectId } = req.body;

    await models.Channel.create({
      name,
      description,
      private,
      projectId
    });

    const project = await models.Project.findAll({
      where: { id: projectId },
      include: [
        {
          model: models.Channel
        }
      ]
    });

    res.json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

router.get("/", checkAuth, async (req, res) => {
  try {
    const { id } = req.query;

    const response = await models.sequelize.transaction(async transaction => {
      const channel = await models.Channel.findAll(
        {
          where: { id }
        },
        { transaction }
      );
      const messages = await models.Message.findAll(
        {
          where: { channelId: id }
        },
        { transaction }
      );

      return { channel, messages };
    });

    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

router.post("/starred", checkAuth, async (req, res) => {
  const starred = await models.Star.create({
    userId: req.user.id,
    channelId: req.body.id,
    star: true
  });
  console.log(starred);
});

router.patch("/", checkAuth, async (req, res) => {
  const { name, description, id } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;

  try {
    const channel = await models.Channel.findOne({ where: id });

    channel.update({
      ...updateData
    });

    res.json(channel);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

router.delete("/", checkAuth, async (req, res) => {
  try {
    const channelId = Number(req.query.data);

    await models.Channel.destroy({
      where: { id: channelId }
    });

    const project = await models.Project.findAll({
      where: { id: projectId },
      include: [
        {
          model: models.Channel
        }
      ]
    });

    res.json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
  console.log(channel);
});
module.exports = router;
