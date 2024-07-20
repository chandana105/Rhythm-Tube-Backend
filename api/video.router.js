const express = require("express");
const router = express.Router();
const { Video } = require("../models/video.model.js");
const { extend } = require("lodash");

router
  .route("/")
  .get(async (_, res) => {
    try {
      const videos = await Video.find({})     ;
      const message =
        videos.length === 0
          ? "There are no videos in the Collection, please start inserting them."
          : undefined;
      res.json({ success: true, videos, message });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to find videos",
        errorMessage: err.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const video = req.body;
      const NewVideo = new Video(video);
      const savedVideo = await NewVideo.save();
      res.json({ success: true, savedVideo });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to save video",
        errorMessage: err.message,
      });
    }
  })
  .delete(async (_, res) => {
    try {
      await Video.deleteMany({});
      res.status(200).json({
        success: true,
        deleted: true,
        message: "All Videos are deleted from this Collection",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        deleted: false,
        message: "Couldn't delete the Collection",
        errorMessage: err.message,
      });
    }
  });

  router.param("videoID", async (req, res, next, videoID) => {
  try {
    const video = await Video.findById(videoID);
    if (!video) {
      return res.status(400).json({
        success: false,
        message: "Couldn't get your video, Please check the videoID again.",
      });
    }
    req.video = video;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Please check your videoID again" });
  }
});

router
  .route("/:videoID")
  .get((req, res) => {
    let { video } = req;
    video.__v = undefined;
    res.json({ success: true, video });
  })
  .post(async (req, res) => {
    const videoUpdates = req.body;
    let { video } = req;
    video = extend(video, videoUpdates);
    video = await video.save();
    res.json({ success: true, updatedVideo: video });
  })
  .delete(async (req, res) => {
    let { video } = req;
    await video.remove();
    res.json({ success: true, deletedVideo: video, deleted: true });
  });


  


module.exports = router;
