const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// start gRPC ONCE
// require("./grpcServer");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", require("./routes/user.route"));
app.use("/api/chat", require("./routes/chat.route"));
app.use("/api/message", require("./routes/message.route"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

const server = app.listen(4000, () =>
  console.log("Server running on http://localhost:4000")
);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("setup", (user) => {
    if (!user?._id) return;
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => socket.join(room));

  socket.on("new message", (msg) => {
    msg.chat.users.forEach((u) => {
      socket.to(u._id).emit("message received", msg);
    });
  });
});
