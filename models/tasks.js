const mongoose = require("mongoose");

const Task = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    enum: ["pending", "completed", "deleted"],
    default: "pending",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Task", Task);
