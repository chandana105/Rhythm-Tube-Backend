const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const mySecret = process.env['SECRET_KEY']

const { User } = require('../models/user.model.js');

const checkExistingUser = async (req, res, next) => {
  try {
    const user = req.body;
    const emailExist = await User.findOne({ email: user.email })
    if (emailExist) {
      return res.status(409).json({ success: false, message: "Email already exists" })
    }
    req.user = user;
    next();
  } catch (err) {
    console.log('AUTH ROUTER', err)
  }
}

router.route('/sign-up')
  .post(checkExistingUser, async (req, res) => {
    try {
      const user = req.user;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt)
      user.password = hashedPassword
      const NewUser = new User(user);
      const savedUser = await NewUser.save();
      res.json({ success: true, message: "User created successfully, Please Login!" })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to Create new User",
        errorMessage: err.message,
      });
    }
  })


const getUserByEmail = async (req, res, next) => {
  try {
    const user = req.body
    const userExist = await User.findOne({ email: user.email })
    if (userExist) {
      const validPassword = await bcrypt.compare(user.password, userExist.password);
      if (validPassword) {
        req.user = userExist;
        return next();
      }
    }
    res.status(401).json({ success: false, message: "Email or password incorrect" })
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Incorrect Email and password" });
  }
}


router.route('/login')
  .post(getUserByEmail, async (req, res) => {
    const { _id, email, password, username } = req.user;
    try {
      const token = await jwt.sign({ userId: _id }, mySecret, { expiresIn: '24h' })
      res.json({ success: true, token, message: "User authenticated successfully" })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Unauthorised Access, Unable to Login User', errorMessage: err.message })
    }

  })



module.exports = router

