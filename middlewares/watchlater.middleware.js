const { Watchlater } = require('../models/watchlater.model.js')

const findWatchlaterListByUserId = async (req, res, next) => {
  const user = req.user
  const { userId } = user
  try {
    const watchlaterList = await Watchlater.findOne({ userId: userId }).populate('watchlater.video');
    if (!watchlaterList) {
      return res.status(400).json({
        success: false,
        message: "Couldn't get the watchlaterList, Please check the userId again.",
      });
    }
    req.watchlaterList = watchlaterList;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Please check your userId again" });
  }
}


const findWatchlaterItemById = async (req, res, next, watchlaterItemId) => {
  try {
    const watchlaterItem = await req.watchlaterList.watchlater.find((videoId) => videoId._id == watchlaterItemId);
    if (!watchlaterItem) {
      return res.status(400).json({ success: false, message: 'This watchlater item doesn\'t exist. Please check with your watchlaterItemId again.' })
    }
    req.watchlaterItem = watchlaterItem;
    next()
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", errorMessage: err.message })
  }
}



module.exports = { findWatchlaterListByUserId, findWatchlaterItemById }
