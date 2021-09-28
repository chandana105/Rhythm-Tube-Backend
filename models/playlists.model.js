const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video"
  },
})


const PlaylistsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    unique: true
  },
  name : {
    type : String,
    unique : true,
    required : "Cannot have a playlist without a name, please give a name to your playlist."
  },
  playlistVideos: [ItemSchema]
}, {
    timestamps: true
  })

const Playlists = mongoose.model("Playlists", PlaylistsSchema)

module.exports = { Playlists }

