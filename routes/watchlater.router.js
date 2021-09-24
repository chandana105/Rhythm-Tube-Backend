const express = require("express");
const router = express.Router();
const { Watchlater } = require('../models/watchlater.model.js')
const { extend, concat } = require("lodash");
const { findWatchlaterListByUserId, findWatchlaterItemById } = require('../middlewares/watchlater.middleware.js')

const addToWatchlater = async (req, res, next) => {
  let { user } = req;
  let { userId } = user;
  const { watchlaterListUpdate } = req.body;
  try {
    let watchlaterListExist = await Watchlater.findOne({ userId: userId });
    watchlaterListUpdate.watchlater[0]._id = watchlaterListUpdate.watchlater[0].video;
    if (watchlaterListExist) {
      watchlaterListExist.watchlater = concat(watchlaterListExist.watchlater, watchlaterListUpdate.watchlater);
      await watchlaterListExist.save()
      return next();
    } else {
      const NewWatchlaterList = await Watchlater({ userId: userId, watchlater: watchlaterListUpdate.watchlater });
      await NewWatchlaterList.save();
      return next();
    }
  } catch (err) {
    console.log('adding to watchlater ', err)
  }
}


router.route('/userId')
  .get(findWatchlaterListByUserId, async (req,res) => {
    const {watchlaterList} = req;
    res.json({ success: true, watchlaterList })
  })
  .post(addToWatchlater, async (req, res) => {
    let { user } = req;
    let { userId } = user;
    try {
      const watchlaterList = await Watchlater.findOne({ userId: userId }).populate('watchlater.video');
      res.json({ success: true, watchlaterList })
    } catch (err) {
      res.status(500).json({ success: false, message: "Unable to add videos to Watchlater", errorMessage: err.message })
    }
  })
  .delete(findWatchlaterListByUserId, async (req, res) => {
    const {watchlaterList} = req;
    const deletedwatchlaterList = await watchlaterList.remove();
    res.json({ success: true, deleted: true, deletedwatchlaterList })
  })

  router.use(findWatchlaterListByUserId)

  router.param('watchlaterItemId' , findWatchlaterItemById ) 

  router
  .route("/userId/:watchlaterItemId")
  .get((req, res) => {
    let { watchlaterItem } = req;
    res.json({ success: true, watchlaterItem });
  })
 

  .delete(async (req, res) => {
    let { watchlaterItem, watchlaterList } = req;
    await watchlaterItem.remove();
    await watchlaterList.save()
    res.json({ success: true, deletedWatchlaterItem: watchlaterItem, deleted: true });
  });


  module.exports = router  




