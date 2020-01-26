const { validationResult } = require("express-validator");
const models = require("../models");

const createProject = async (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.user.id;
  try {
    const createProject = await models.sequelize.transaction(
      async transaction => {
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
              description:
                "Company-wide announcements and work-related matters",
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
        channelMember = channelIds.map(x => ({ channelId: x, userId }));
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
      }
    );

    const project = await models.Project.findOne({
      where: {
        id: createProject.id
      },
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

    if (member)
      return res
        .status(400)
        .json({ errors: [{ msg: "User already in project." }] });

    const projectMember = await models.ProjectMember.create({
      userId,
      projectId
    });

    // console.log(memberCreated);
    res.json(projectMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

const fetchProject = async (req, res) => {
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
};

module.exports = {
  createProject,
  addUserToProject,
  fetchProject
};
