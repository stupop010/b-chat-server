const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const checkAuth = require("../middleware/checkAuth");
const {
  createProject,
  addUserToProject,
  fetchProject
} = require("../controllers/projects");

router.post("/", checkAuth, createProject);

router.post(
  "/addUser",
  checkAuth,
  [check("email").isEmail()],
  addUserToProject
);

router.get("/", checkAuth, fetchProject);

module.exports = router;
