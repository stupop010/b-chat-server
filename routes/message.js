const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/checkAuth");

const {
  editMessage,
  createPin,
  fetchPinnedMessage
} = require("../controllers/message");

router.patch("/", checkAuth, editMessage);

router.post("/pinned", checkAuth, createPin);

router.get("/pinned", checkAuth, fetchPinnedMessage);

module.exports = router;
