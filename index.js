const express = require("express");
require("dotenv").config();
const { initializeDBConnection } = require("./dbConfig");
const cors = require("cors");
const PORT = process.env.PORT || 3003;
const app = express();

app.use(cors());
initializeDBConnection();
app.use(express.json({ extended: false }))

const userRouter = require("./routes/user.router");


app.use("/users",userRouter)

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
