const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

const Post = mongoose.model("Post", postSchema); //schema를 model로 감싼다.

module.exports = { Post };
