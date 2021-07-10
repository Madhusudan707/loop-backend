const express = require("express");
require("dotenv").config();
const { initializeDBConnection } = require("./dbConfig");
const cors = require("cors");
const PORT = process.env.PORT || 3003;
const app = express();

app.use(cors());

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', function(socket) {
  console.log("Connected")
});

initializeDBConnection();
app.use(express.json({ extended: false }));

const userRouter = require("./routes/user.router");
const postRouter = require("./routes/post.router");
const feedRouter = require("./routes/feed.router");
const searchRouter = require("./routes/search.router");
const notificationRouter = require("./routes/notification.router");


const { Notification } = require("./models/notification.model")
const changeStream = Notification.watch();

changeStream.on("change", async (change) => {

  const id = change.fullDocument._id
  const notif = await Notification.findById(id).populate({ path: "actionCreatorId", select: "_id name username" });

  io.emit("changeData", notif)
})


app.use("/users", userRouter);
app.use("/post", postRouter);
app.use("/feed", feedRouter);
app.use("/search", searchRouter);
app.use("/notification", notificationRouter);

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/welcome.html");
});

/**
 * 404 Route Handler
 * Note: DO not MOVE. This should be the last route
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found on server, please check",
  });
});

/**
 * Error Handler
 * Don't move
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "error occurred, see the errMessage key for more details",
    errorMessage: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
