require("dotenv").config();
require("./db/firebase-config");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const fs = require("file-system");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const cors = require("cors");
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use("/", userRoutes);

io.on("connection", (client) => {
  console.log("connected");
  client.on("join", (room) => {
    console.log("room", room);
    client.join(room);
  });
  client.on("code", (data) => {
    client.to(data.room).emit("code", data.code);
  });

  client.on("run", async (data) => {
    console.log(data);
    await fs.writeFile("code-file/code.js", data.code);
    try {
      console.log("wprk", data);
      const { stdout, stderr } = await exec("node code-file/code.js");

      console.log("std", stdout, stderr);
      io.sockets.in(data.room).emit("output", stdout);
    } catch (err) {
      io.sockets.in(data.room).emit("output", err);
    }
  });
});
io.on("disconnect", (evt) => {
  console.log("People Left !!!");
});

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
