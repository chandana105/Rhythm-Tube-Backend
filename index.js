const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser')
const cors = require("cors");
const { initializeDBConnection } = require("./db/db.connect.js");
const { errorHandler } = require("./middlewares/error-handler.middleware.js");
const {
  routeNotFound,
} = require("./middlewares/route-not-found.middleware.js");
const {
  authVerify,
} = require("./middlewares/auth-handler.middleware.js");

const app = express();
app.use(bodyParser.json());
app.use(cors());

initializeDBConnection();


const insertIntoDB = require("./routes/insertIntoDB.router");
const videos = require("./routes/video.router");
const categories = require('./routes/category.router.js')
const user = require("./routes/user.router");
const auth = require('./routes/auth.router.js')
const watchlater = require('./routes/watchlater.router.js');
const likedVideos = require('./routes/likedVideos.router.js');
const playlists = require('./routes/playlists.router.js');

app.get('/', (req, res) => {
  res.send('Welcome to Rhythm Tube')
});

app.use("/insert", insertIntoDB);
app.use("/videos", videos);
app.use('/categories' , categories);
app.use('/auth' , auth)
app.use('/user' , authVerify , user)
app.use('/watchlater', authVerify, watchlater)
app.use('/likedVideos', authVerify, likedVideos)
app.use('/playlists', authVerify, playlists)



app.use(routeNotFound);
app.use(errorHandler);

const PORT = 8000;
app.listen(PORT, () => {
  console.log('server started at port' , PORT);
});