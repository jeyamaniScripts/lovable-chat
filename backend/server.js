const express = require("express");
const chats = require("./data/data");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("server running");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  console.log(req.params.id);
  //   console.log(chats);

  const singleChat = chats.find((c) => {
    console.log(c._id);
    return c._id === req.params.id;
  });
  res.send(singleChat);
});

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
