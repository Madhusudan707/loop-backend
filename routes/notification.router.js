const express = require("express");
const router = express.Router();
const { authenticateUser, catchError } = require("../utility")
const { Notification, UserNotification } = require("../models/notification.model");

router.route("/")
  .get(authenticateUser, async (req, res, next) => {
    catchError(next, async () => {

      const notificationList = await UserNotification.findById(req.userId).populate({
        path: "notificationList",
        populate: { path: "actionCreatorId", select: "_id name username" }
      });

      res.json({
        success: true,
        notificationList
      })
    })
  })

module.exports = router;