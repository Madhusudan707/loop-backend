const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../utility");
const {
  registerUserAndSendUserData,
  loginUserAndSendUserData,
  getUserData,
  updateUserImage,
  updateUserBio,
  getLoggedInUserData,
  getUserNetwork,
  addNewFollowing,
  removeFollowing,
  getSearchedUser,
} = require("../controllers/users.controller");
const { update } = require("lodash");

router.route("/register").post(registerUserAndSendUserData);

router.route("/login").post(loginUserAndSendUserData);

router.route("/:username").get(getUserData);
router.route("/").get(authenticateUser, getLoggedInUserData);

router.route("/updateImage").post(authenticateUser, updateUserImage);
router.route("/updateBio").post(authenticateUser, updateUserBio);
// router.route("/updateImage").post(updateUserImage);
// router.route("/updateBio").post(updateUserBio);

router.route("/network/:username").get(authenticateUser, getUserNetwork);

router.route("/network/follow").post(authenticateUser, addNewFollowing);

router.route("/network/unfollow").post(authenticateUser, removeFollowing);

router.route("/search").post(getSearchedUser);

module.exports = router;
