const express = require("express");
const router = express.Router();

const { editMessage } = require("../controllers/message");

router.patch("/", editMessage);

module.exports = router;
