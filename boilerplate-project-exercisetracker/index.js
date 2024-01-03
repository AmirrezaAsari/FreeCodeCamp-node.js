const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let users = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const userName = req.body.username;
  const newUser = {
    username: userName,
    _id: Math.random().toString(36).slice(2),
  };
  users.push(newUser);
  res.json(newUser);
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
