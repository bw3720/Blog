//서버의 시작점
const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { User } = require("./models/User");
const { Post } = require("./models/Post");

const config = require("./config/key"); //key 현재 환경을 읽어와서 mongoDB 접속 주소 어떻게 줄지 정함

const cookieParser = require("cookie-parser");

const { auth } = require("./middleware/auth");

//바디파서 : 클라이언트에서 오는 정보를 서버에서 분석해서 들여올수있게 하는것
//application/x-www-form-urlencoded 해석
// app.use(bodyParser.urlencoded({ extended: true }));

// //application/json 해석
// app.use(bodyParser.json());

//버전 업으로 express 에서 사용 가능.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/api/blog/getgetget", (req, res) => {
  res.send("test");
});

app.post("/api/blog/regi", (req, res) => {
  const post = new Post(req.body);
  post
    .save()
    .then((userInfo) => res.status(200).json({ success: true })) //status(200) 통신 성공 이라는 뜻...!
    .catch((err) => res.json({ success: false, err }));
  // res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
