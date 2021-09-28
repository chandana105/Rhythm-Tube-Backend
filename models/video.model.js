const mongoose = require("mongoose");
require("mongoose-type-url");
const { Schema } = mongoose;

const VideoSchema = new Schema({
  videoId : {
    type : String,
    unique : true,
    index: true,
    required : 'Cannot have a video without its ID, please enter the id'
  },
  hashTag : String,
  title : {
    type: String,
    unique : true,
    required : "Cannot have a video without its title, please enter the title"
  },
  viewsCount : String,
  uploadDate : {
    type: String,
    required: "Cannot have a video without its uploading date, please enter the upload Date of video",
  },
  channelName : {
    type : String,
    required : "Cannot have a video without its channel name, please enter the channel name of video"
  },
  channelLogo : String,
  subscriberCount : String,
  description : String,
  duration : {
    type : String ,
    required : "Cannot have a video without its time duration, please enter the duration of video"
  },
  category : [String] 
},
{
    timestamps: true,
})




const Video = mongoose.model("Video", VideoSchema);

module.exports = { Video };