const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video"
  },
})


const LikedVideosSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    unique: true
  },
  likedVideos: [ItemSchema]
}, {
    timestamps: true
  })

const LikedVideos = mongoose.model("LikedVideos", LikedVideosSchema)

module.exports = { LikedVideos }

