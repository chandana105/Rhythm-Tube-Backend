const mySecret = process.env['MONGO_URI']
const mongoose = require("mongoose");

const initializeDBConnection = async () => {
  try {
    await mongoose.connect(mySecret, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongodb successfully connected");
  } catch (err) {
    console.error("mongoose connection failed", err);
  }
};

module.exports = { initializeDBConnection };