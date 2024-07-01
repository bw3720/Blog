//서버의 시작점
const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://pokbw3720:1a0cf36212@reactstudy.04taxau.mongodb.net/?retryWrites=true&w=majority&appName=reactStudy"
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

//

app.get("/", (req, res) => {
  res.send("Hello World! 안녕하세요");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
