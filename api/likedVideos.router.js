const express = require("express");
const router = express.Router();
const { LikedVideos } = require('../models/likedVideos.model.js')
const { extend, concat } = require("lodash");
const { findLikedVideosByUserId, findLikedVideosItemById } = require('../middlewares/likedVideos.middleware.js')


const addToLikedVideos = async (req, res, next) => {
  let { user } = req;
  let { userId } = user;
  const { likedVideosUpdate } = req.body;
  try {
    let likedVideosExist = await LikedVideos.findOne({ userId: userId });
    likedVideosUpdate.likedVideos[0]._id = likedVideosUpdate.likedVideos[0].video;
    if (likedVideosExist) {
      likedVideosExist.likedVideos = concat(likedVideosExist.likedVideos, likedVideosUpdate.likedVideos);
      await likedVideosExist.save()
      return next();
    } else {
      const NewLikedVideos = await LikedVideos({ userId: userId, likedVideos: likedVideosUpdate.likedVideos });
      await NewLikedVideos.save();
      return next();
    }
  } catch (err) {
    console.log('adding to likedVideos ', err)
  }
}

router.route('/userId')
  .get(findLikedVideosByUserId, async (req,res) => {
    const {likedVideos} = req;
    res.json({ success: true, likedVideos })
  })
  .post(addToLikedVideos, async (req, res) => {
    let { user } = req;
    let { userId } = user;
    try {
      const likedVideos = await LikedVideos.findOne({ userId: userId }).populate('likedVideos.video');
      res.json({ success: true, likedVideos })
    } catch (err) {
      res.status(500).json({ success: false, message: "Unable to add videos to likedVideos", errorMessage: err.message })
    }
  })
  .delete(findLikedVideosByUserId, async (req, res) => {
    const { likedVideos } = req;
    const deletedLikedVideos = await likedVideos.remove();
    res.json({ success: true, deleted: true, deletedLikedVideos })
  })

  router.use(findLikedVideosByUserId)

  router.param('likedVideosItemId' , findLikedVideosItemById ) 

   router
  .route("/userId/:likedVideosItemId")
  .get((req, res) => {
    let { likedVideosItem } = req;
    res.json({ success: true, likedVideosItem });
  })
 

  .delete(async (req, res) => {
    let { likedVideosItem, likedVideos } = req;
    await likedVideosItem.remove();
    await likedVideos.save()
    res.json({ success: true, deletedLikedVideosItem: likedVideosItem, deleted: true });
  });



module.exports = router  

