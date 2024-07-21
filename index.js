const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
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

// Configure CORS to allow requests from your frontend's origin
app.use(cors({
  origin: 'http://localhost:3000', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true // Allow cookies and other credentials
}));

// Handle preflight requests
app.options('*', cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

initializeDBConnection();

const insertIntoDB = require("./api/insertIntoDB.router.js");
const videos = require("./api/video.router.js");
const categories = require('./api/category.router.js');
const user = require("./api/user.router.js");
const auth = require('./api/auth.router.js');
const watchlater = require('./api/watchlater.router.js');
const likedVideos = require('./api/likedVideos.router.js');
const playlists = require('./api/playlists.router.js');

app.get('/', (req, res) => {
  res.send('Welcome to Rhythm Tube');
});

app.use("/insert", insertIntoDB);
app.use("/videos", videos);
app.use('/categories', categories);
app.use('/auth', auth);
app.use('/user', authVerify, user);
app.use('/watchlater', authVerify, watchlater);
app.use('/likedVideos', authVerify, likedVideos);
app.use('/playlists', authVerify, playlists);

app.use(routeNotFound);
app.use(errorHandler);

const PORT = 8000;
app.listen(PORT, () => {
  console.log('server started at port', PORT);
});
