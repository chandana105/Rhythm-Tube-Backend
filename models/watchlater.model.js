const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video"
  },
})


const WatchlaterSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    unique: true
  },
  watchlater: [ItemSchema]
}, {
    timestamps: true
  })

const Watchlater = mongoose.model("Watchlater", WatchlaterSchema)

module.exports = { Watchlater }

