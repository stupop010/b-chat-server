const { validationResult } = require("express-validator");
const uuidv4 = require("uuid/v4");

const models = require("../models");

const createProject = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;
  try {
    await models.sequelize.transaction(async transaction => {
      const project = await models.Project.create(
        {
          name,
          description
        },
        { transaction }
      );

      const channels = await models.Channel.bulkCreate(
        [
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
          }
        ],
        { transaction }
      );

      // Creating the channel member table
      const channelIds = [];
      channels.map(x => channelIds.push(x.get("id")));
      channelMember = channelIds.map(x => ({
        channelId: x,
        userId,
        admin: true
      }));
      await models.ChannelMember.bulkCreate(channelMember, { transaction });

      // Create project member table
      const projectId = project.get("id");
      await models.ProjectMember.create(
        {
          projectId,
          userId,
          admin: true
        },
        { transaction }
      );

      return project;
    });

    const user = await models.User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
      include: [{ model: models.Project, include: [{ model: models.Channel }] }]
    });

    const project = user.projects;
    res.json(project);
  } catch (err) {
    console.log(err);
  }
};

const addUserToProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, projectId } = req.body;
  try {
    const user = await models.User.findOne({
      where: { email }
    });

    if (!user)
      return res.status(400).json({ errors: [{ msg: "No user found." }] });
    const userId = user.get("id");

    const member = await models.ProjectMember.findOne({
      where: {
        userId,
        projectId
      }
    });

    const projects = await models.Project.findOne({
      where: { id: projectId },
      include: [
        {
          model: models.Channel
        }
      ]
    });

    if (member)
      return res
        .status(400)
        .json({ errors: [{ msg: "User already in project." }] });

    const channels = projects.get("channels");
    let channelArray = [];
    channels.map(channel => channelArray.push(channel.dataValues));
    const channelMember = channelArray.map(channel => ({
      channelId: channel.id,
      userId,
      admin: false
    }));

    await models.sequelize.transaction(async transaction => {
      await models.ChannelMember.bulkCreate(channelMember, { transaction });
      await models.ProjectMember.create(
        {
          userId,
          projectId
        },
        { transaction }
      );
    });

    // console.log(memberCreated);
    // res.json(projectMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

const fetchProject = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await models.User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
      include: [{ model: models.Project, include: [{ model: models.Channel }] }]
    });

    const projects = user.projects;

    res.json(projects);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createProject,
  addUserToProject,
  fetchProject
};
