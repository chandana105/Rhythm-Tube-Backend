const express = require("express");
const router = express.Router();
const { Playlists } = require('../models/playlists.model.js')
const { extend, concat } = require("lodash");
const { findPlaylistsByUserId, findPlaylistByPlaylistId, findVideoByVideoId } = require('../middlewares/playlists.middleware.js')


router.route('/userId')
  .get(findPlaylistsByUserId, async (req, res) => {
    const { playlists } = req;
    res.json({ success: true, playlists })
  })
  .post(async (req, res) => {
    let { user } = req;
    let { userId } = user;
    const newPlaylist = req.body;
    newPlaylist.userId = userId;
    newPlaylist.playlistVideos.map(item => item._id = item.video)
    try {
      const NewPlaylist = new Playlists(newPlaylist);
      const savedPlaylist = await NewPlaylist.save();
      const newPlaylistCreated = { _id: savedPlaylist._id, name: savedPlaylist.name, videos: savedPlaylist.playlistVideos[0] }
      res.json({ success: true, newPlaylistCreated });
    } catch (err) {
      res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: err.message })
    }
  })
  .delete(findPlaylistsByUserId, async (req, res) => {
    const { user } = req;
    const { userId } = user;
    try {
      const removedPlaylists = await Playlists.deleteMany({ userId: userId })
      res.json({ success: true, deleted: true, removedPlaylists })
    } catch (err) {
      res.status(500).json({ deleted: false, success: false, message: "Couldn't delete all the playlists", errorMessage: err.message })
    }
  })

router.use(findPlaylistsByUserId)


router.param('playlistId', findPlaylistByPlaylistId)

router
  .route("/userId/:playlistId")
  .get((req, res) => {
    const { playlist } = req;
    res.json({ success: true, playlist });
  })
  .post(async (req, res) => {
    let { playlist } = req;
    const updatePlaylist = req.body;
    try {
      updatePlaylist.playlistVideos.map(item => item._id = item.video)
      const isSameVideoPresent = playlist.playlistVideos.some(item => item._id === updatePlaylist.playlistVideos[0].video)
      if (isSameVideoPresent) {
        return res.status(400).json({ success: false, message: "Sorry, Item is already present in the list. Please check with the video id again" })
      } else {
        playlist.playlistVideos = concat(playlist.playlistVideos, updatePlaylist.playlistVideos)
      }
      const updatedPlaylist = await playlist.save()
      res.json({ success: true, updatedPlaylist })
    } catch (err) {
      res.status(500).json({ success: false, message: "Coudn't update the  playlist", errorMessage: err.message })
    }
  })
  .delete(async (req,res) => {
    const { playlist } = req;
    try {
      await playlist.remove()
      res.json({success : true, deleted : true, deletedPlaylist : playlist})    
    } catch (err) {
      res.status(500).json({ deleted: false, success: false, message: "Couldn't delete playlist", errorMessage: err.message })
    }
  })

  router.param('videoId',  findVideoByVideoId)

router
  .route("/userId/:playlistId/:videoId")
  .get((req, res) => {
    const { video } = req;
    res.json({ success: true, video });
  })
  .delete(async (req,res) => {
    const {video, playlist} = req;
    try{
    await video.remove()
    await playlist.save()
    res.json({success:true, deletedVideo : video, deleted:true})
  }catch(error){
    res.status(500).json({success:false, message:"Couldn't remove the video", errorMessage:err.message})
  }
  })




module.exports = router




// router.route('/userId')
//   // get all playlists of particular user
//   .get(async (req, res) => {
//     const { playlists } = req;
//     console.log({playlists}, 'play')
//     res.json({ success: true, playlists })
//   })
//   // to add a new playlist to the user, not to check whetther playlist of that particulr  user exists or not as we can create n no. of plalists for a partculr user 
//   .post(async (req, res) => {
//     let { user } = req;
//     let { userId } = user;
//     console.log({userId}, 'userid')
//     const  newPlaylist  = req.body
//     newPlaylist.playlistVideos.map(item => item._id === item.video)
//     // playlsitvideos = [videos], videos : {} :- playlsitvideos :- [{_id,video1}, {_id,video2}]

//  // to delete all the playlsits of particulr user id
//   .delete(async (req, res) => {


// .post(async (req, res) => {
//     let { user } = req;
//     let { userId } = user;
//     const newPlaylist = req.body;
//     newPlaylist.userId = userId;
//     newPlaylist.playlistVideos.map(item => item._id = item.video)
//     try {
//       const NewPlaylist = new Playlists(newPlaylist);
//       const savedPlaylist = await NewPlaylist.save();
//       // as at a time only one video ll be added to new playlsit or already made playlist
// console.log(savedPlaylist.playlistVideos[0], 'pl')

//       res.json({ success: true, savedPlaylist });
//     } catch (err) {
//       res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: err.message })
//     }
//   })