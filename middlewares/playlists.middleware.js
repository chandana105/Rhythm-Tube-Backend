const { Playlists } = require('../models/playlists.model.js')

const findPlaylistsByUserId = async (req, res, next) => {
  const user = req.user
  const { userId } = user;

  try {
    const playlists = await Playlists.find({ userId: userId }).populate('playlistVideos.video');
    if (playlists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User dosen't have any playlist.",
      });
    }
    req.playlists = playlists;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Please check your userId again" });
  }
}

const findPlaylistByPlaylistId = async (req, res, next, playlistId) => {
  try {
    const playlist = await req.playlists.find((item) => item._id == playlistId)
    if (!playlist) {
      return res.status(400).json({ success: false, message: 'This playlist item doesn\'t exist. Please check with your playlistId again.' })
    }
    req.playlist = playlist;
    next()
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", errorMessage: err.message })
  }
}

const findVideoByVideoId = async (req, res, next, videoId) => {
  const {playlist} = req;
  try{
  // const video = playlist.playlistVideos.find((video) => video._id == videoId);
  const video = playlist.playlistVideos.id(videoId) //??

// console.log(playlist.playlistVideos.id, 'id')

  if(!video){
      return res.status(400).json({success:false, message:'Sorry,This video item doesn\'t exist. Please check with your videoId again.'})
    }
    req.video = video
    next()
  } catch (err) {
    res.status(400).json({success:false, message:"Sorry, Something went wrong", errorMessage:err.message})

  }

}


module.exports = { findPlaylistsByUserId, findPlaylistByPlaylistId , findVideoByVideoId}