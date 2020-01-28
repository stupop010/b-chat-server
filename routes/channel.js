const express = require("express");
const router = express.Router();

const models = require("../models");
const checkAuth = require("../middleware/checkAuth");
const {
  deleteChannel,
  createChannel,
  fetchChannel
} = require("../controllers/channel");

router.post("/", checkAuth, createChannel);

router.get("/", checkAuth, fetchChannel);

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

router.delete("/", checkAuth, deleteChannel);
module.exports = router;
