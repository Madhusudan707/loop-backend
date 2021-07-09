const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users.model');
const { catchError } = require('../utility');
const bcrypt = require("bcrypt");
const secret = process.env.SECRET;

const registerUserAndSendUserData = async (req, res, next) => {
    catchError(next, async () => {
      let { user } = req.body;
      const salt = await bcrypt.genSalt(10);
      console.log("x",user)
      user.password = await bcrypt.hash(user.password, salt);
      let newUser = new User(user);
      newUser = await newUser.save();
      const token = jwt.sign({ _id: newUser._id }, secret, { expiresIn: "24h" });
      let userData = _.pick(newUser, ["_id", "name", "email", "username", "bio", "profileURL", "followingList", "followersList"])
      userData = _.extend(userData, { token });
      res.json({
        success: true,
        user: userData
      });
    });
  }

  const loginUserAndSendUserData = async (req, res, next) => {
    catchError(next, async () => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        const validPassword = await bcrypt.compare(password, user.password)
        console.log(secret)
        if (validPassword) {
          const token = jwt.sign({ _id: user._id }, secret, { expiresIn: "24h" });
          let userData = _.pick(user, ["_id", "name", "email", "username", "bio", "profileURL", "followingList", "followersList"])
          userData = _.extend(userData, { token });
          return res.json({
            success: true,
            user: userData
          });
        }
        return res.status(401).json({
          success: false,
          message: "Authentication error!"
        });
      }
      return res.json({
        success: false,
        message: "User not found!"
      });
    });
  }

  const getLoggedInUserData = async (req, res, next) => {
    catchError(next, async () => {
      const user = await User.findById(req.userId);
      if (user) {
        return res.json({
          success: true,
          user: _.pick(user, ["_id", "name", "email", "username", "bio", "profileURL", "followingList", "followersList"])
        });
      }
      return res.json({
        success: false,
        message: "User not found!"
      });
    });
  }

  const getUserData = async (req, res, next) => {
    catchError(next, async () => {
      const { username } = req.params;
      const user = await User.find({ username });
      if (user) {
        return res.json({
          success: true,
          user: _.pick(user[0], ["_id", "name", "email", "username", "bio", "profileURL", "followingList", "followersList"])
        });
      }
      return res.json({
        success: false,
        message: "User not found!"
      });
    });
  }
  

  const updateUserImage = async (req, res, next) => {
    catchError(next, async () => {
      const { profileURL,_id } = req.body;
      let user = await User.findById(_id);
     
      if (user) {
        user = _.extend(user, { profileURL });
        user = await user.save();
        return res.json({
          success: true,
          user: _.pick(user, ["_id", "bio", "profileURL"])
        });
      }
      return res.json({
        success: false,
        message: "User not found!"
      });
    });
  }

  const updateUserBio = async (req, res, next) => {
    catchError(next, async () => {
      const { bio,_id} = req.body;
      let user = await User.findById(_id);
     
      if (user) {
        user = _.extend(user, { bio });
        user = await user.save();
        return res.json({
          success: true,
          user: _.pick(user, ["_id", "bio"])
        });
      }
      return res.json({
        success: false,
        message: "User not found!"
      });
    });
  }

  module.exports={registerUserAndSendUserData,loginUserAndSendUserData,getLoggedInUserData,getUserData,updateUserImage,updateUserBio }