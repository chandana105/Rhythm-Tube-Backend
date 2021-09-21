const mongoose = require("mongoose");
require("mongoose-type-url");
const { Schema } = mongoose;


const UserSchema = new Schema({
  username : {
    type : String,
    unique : true,
    trim : true,
    required : "Cannot have a user without username , please enter username",
    minLength : [4 , "Username should be minimum of 4 characters"],
    maxLength : [20 , "Username can only have maximum of 20 characters"],
  },
  email : {
    type : String,
    unique : true,
    trim : true,
    index : true,
    required : 'Cannot enter a user without email, please enter email',
  },
  password : {
    type : String,
    required : 'Cannot enter a user without password, please enter password',
  }
} , {
  timestamps : true
})

const User = mongoose.model("User" , UserSchema)

module.exports = { User }