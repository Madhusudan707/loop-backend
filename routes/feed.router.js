const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../utility")

const { getFeed } = require("../controllers/feed.controller")

router.route("/")
  .get(authenticateUser, getFeed)

module.exports = router;