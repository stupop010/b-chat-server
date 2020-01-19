const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const models = require("./models");
const config = require("./config");

const socket = require("./socket");

const registerRouter = require("./routes/register");
const authRouter = require("./routes/auth");
const projectRouter = require("./routes/project");
const channelRouter = require("./routes/channel");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || config.PORT;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/project", projectRouter);
app.use("/api/register", registerRouter);
app.use("/api/auth", authRouter);
app.use("/api/channel", channelRouter);

socket(io);

models.sequelize.sync().then(function() {
  server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
});
