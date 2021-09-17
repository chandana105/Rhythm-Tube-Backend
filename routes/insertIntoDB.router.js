const express = require("express");
const router = express.Router();
const { Video } = require("../models/video.model.js");
const { videoList } = require("../data/video-data.js");

const { Category } = require('../models/category.model.js');
const { categoryList } = require('../data/category-data.js')


router.route('/videos')
  .get(async (_,res) => {
    try{
      videoList.forEach(async video => {
        const isVideoMatched = await Video.findOne({title : video.title})
        if (isVideoMatched) return;

        const newVideo = await Video({
          videoId : video.videoId,
          hashTag : video.hashTag,
          title : video.title,
          viewsCount : video.viewsCount,
          uploadDate : video.uploadDate,
          channelName : video.channelName,
          channelLogo : video.channelLogo,
          subscriberCount : video.subscriberCount,
          description : video.description,
          duration : video.duration,
          category : video.category
        })

        const saved = await newVideo.save()
        if (!saved) {
        console.log("This videoItem is not saved:", saved);
        }
        });
       res.json({
      success: true,
      message: "All Video items are inserted into DB",
      });
    } catch (err) {
      res.status(500).json({
      success: false,
      message: "Unable to insert the videoItems",
      errorMessage: err.message,
    });  
    }
  })

router.route('/categories')
  .get(async (req, res) => {
    try {
      categoryList.forEach(category => {
        videoList.forEach(async video => {
          const isVideoPresent = await Video.findOne({ title: video.title })
          if (!isVideoPresent) return;
          isVideoPresent.category.forEach(name => {
            if (name === category.name) {
               category.videos.push(isVideoPresent._id)
            }
          })
        })
      })
      const savedCategories = await Category.insertMany(categoryList);
      res.json({
        success: true, message: "Categories are inserted into DB",
        savedCategories
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to insert all the categories",
        errorMessage: err.message
      })
    }
  })


  


  module.exports = router;
