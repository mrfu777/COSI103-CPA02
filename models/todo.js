const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  todo: String,
  user: String,
  done: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("todo", TodoSchema);