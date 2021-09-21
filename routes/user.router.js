const express = require("express");
const router = express.Router();
const { User } = require("../models/user.model.js");
const {findUserById} = require('../middlewares/user.middleware.js')
const { extend } = require("lodash"); 

router
  .route('/')
    .get(async (req,res) => {
      try {
        const users = await User.find({});
        res.json({success : true , users})
      } catch (err) {
        res.status(500).json({
        success: false,
        message: "Unable to find users",
        errorMessage: err.message,
      });
      }
    })

    .delete(async (req, res) => {
    try {
      await User.deleteMany({});
      res.status(200).json({
        success: true,
        deleted: true,
        message: "All Users are deleted from the Collection",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        deleted: false,
        message: "Couldn't delete the Collection",
        errorMessage: err.message,
      });
    }
    })


router.use(findUserById)

router
  .route("/userId")
  .get((req, res) => {
    let { user } = req;
    user.__v = undefined;
    res.json({ success: true, user });
  })
 .post(async (req, res) => {
   try{
    const userUpdates = req.body;
    let { user } = req;
    user = extend(user, userUpdates);
    user = await user.save();
    res.json({ success: true, updatedUser: user });
   }catch (err) {
      res.status(500).json({
        success: false,
        message: "Couldn't update the User",
        errorMessage: err.message,
      });
    }
  })
  .delete(async (req, res) => {
    let {user} = req;
    await user.remove()
    res.json({ success: true, deletedUser: user, deleted: true });
    })

module.exports = router;



