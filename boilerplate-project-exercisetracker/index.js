const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let users = [];
let exercise = [];
let logs = [];

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

app.post("/api/users/:_id/exercises", (req, res) => {
  const { description, duration, date } = req.body;
  const userId = req.params._id;
  let user = users.find((user) => user._id === userId);

  if (!user) {
    return res.json({ error: "User not found" });
  }

  const newExercise = {
    username: user.username,
    description: description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
    _id: user._id,
  };

  user = { ...user, ...newExercise };
  exercise.push(newExercise);
  logs.push(newExercise);

  res.json({
    _id: user._id,
    username: user.username,
    description: description,
    duration: newExercise.duration,
    date: newExercise.date,
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const userId = req.params._id;
  const user = users.find((user) => user._id === userId);

  if (!user) {
    return res.json({ error: "User not found" });
  }

  const { from, to, limit } = req.query;
  let filteredLogs = logs.filter((log) => log._id === userId);

  if (from) {
    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.date) >= new Date(from),
    );
  }

  if (to) {
    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.date) <= new Date(to),
    );
  }

  if (limit) {
    filteredLogs = filteredLogs.slice(0, parseInt(limit));
  }

  const response = {
    _id: user._id,
    username: user.username,
    count: filteredLogs.length,
    log: filteredLogs.map((logItem) => ({
      description: logItem.description,
      duration: Number(logItem.duration),
      date: logItem.date,
    })),
  };

  res.json(response);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});