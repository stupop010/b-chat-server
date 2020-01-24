const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const isEmpty = require("lodash.isempty");

const models = require("../models");
const checkAuth = require("../middleware/checkAuth");

router.post("/", checkAuth, [check("email").isEmail()], async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.user;
  try {
    const project = await models.sequelize.transaction(async transaction => {
      const project = await models.Project.create(
        {
          name,
          description
        },
        { transaction }
      );

      await models.Channel.bulkCreate([
        {
          name: "general",
          description: "Company-wide announcements and work-related matters",
          private: false,
          projectId: project.id
        },
        {
          name: "random",
          description: "Non-work banter and water cooler conversation",
          private: false,
          projectId: project.id
        },
        { transaction }
      ]);
      // await models.Channel.create(
      //   {
      //     name: "general",
      //     description: "Company-wide announcements and work-related matters",
      //     private: false,
      //     projectId: project.id
      //   },
      //   { transaction }
      // );

      // await models.Channel.create(
      //   {
      //     name: "random",
      //     description: "Non-work banter and water cooler conversation",
      //     private: false,
      //     projectId: project.id
      //   },
      //   { transaction }
      // );

      await models.Member.create(
        {
          projectId: project.id,
          userId: id
        },
        { transaction }
      );
      return project;
    });
    console.log(project);

    const projects = await models.Project.findAll({
      include: [
        {
          model: models.User,
          attributes: { exclude: ["password"] }
        },
        {
          model: models.Channel
        },
        { models: models.Member, where: { projectId: project.id } }
      ]
    });
    res.json(projects);
  } catch (err) {
    console.log(err);
  }
});

router.post("/addUser", checkAuth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, projectId } = req.body;
  try {
    const user = await models.User.findOne({
      where: { email }
    });

    const userId = user.getDataValue("id");
    if (!user)
      return res.status(400).json({ errors: [{ msg: "No user found." }] });

    const member = await models.Member.findAll({
      where: {
        userId,
        projectId
      }
    });

    if (!isEmpty(member))
      return res
        .status(400)
        .json({ errors: [{ msg: "User already in project." }] });

    const memberCreated = await models.Member.create({
      userId,
      projectId
    });

    console.log(memberCreated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

router.get("/", checkAuth, async (req, res) => {
  const { id } = req.user;
  try {
    const projects = await models.Project.findAll({
      include: [
        {
          model: models.User,
          attributes: { exclude: ["password"] }
        },
        {
          model: models.Channel
        }
      ]
    });
    res.json(projects);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
