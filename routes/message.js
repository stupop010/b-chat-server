const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/checkAuth");

const { editMessage, createPin } = require("../controllers/message");

router.patch("/", checkAuth, editMessage);

router.post("/pinned", checkAuth, createPin);

module.exports = router;
