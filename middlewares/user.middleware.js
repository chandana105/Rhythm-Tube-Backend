const { User } = require("../models/user.model.js");

const findUserById = async (req, res, next) => {
  const user = req.user;
  const { userId } = user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Couldn't get the user, Please check the userId again.",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Please check your userId again" });
  }
}

module.exports = { findUserById }