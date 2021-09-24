const { LikedVideos } = require('../models/likedVideos.model.js')

const findLikedVideosByUserId = async (req, res, next) => {
  const user = req.user
  const { userId } = user
  try {
    const likedVideos = await LikedVideos.findOne({ userId: userId }).populate('likedVideos.video');
    if (!likedVideos) {
      return res.status(400).json({
        success: false,
        message: "Couldn't get the likedVideos, Please check the userId again.",
      });
    }
    req.likedVideos = likedVideos;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Please check your userId again" });
  }
}


const findLikedVideosItemById = async (req, res, next, likedVideosItemId) => {
  try {
    const likedVideosItem = await req.likedVideos.likedVideos.find((videoId) => videoId._id == likedVideosItemId);
    if (!likedVideosItem) {
      return res.status(400).json({ success: false, message: 'This likedVideo item doesn\'t exist. Please check with your likedVideosItemId again.' })
    }
    req.likedVideosItem = likedVideosItem;
    next()
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", errorMessage: err.message })
  }
}



module.exports = { findLikedVideosByUserId, findLikedVideosItemById }
