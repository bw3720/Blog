//서버의 시작점
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { User } = require("./models/User");

const config = require("./config/key"); //key 현재 환경을 읽어와서 mongoDB 접속 주소 어떻게 줄지 정함

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

//

app.get("/", (req, res) => {
  res.send("Hello World! 안녕하세요. sssssssss");
});

app.post("/register", (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  //   user.save((err, userInfo) => {
  //     if (err) return res.json({ success: false, err });
  //     return res.status(200).json({
  //       success: true,
  //     });
  //   });
  //

  //버전 업그레이드로 인한 기존소스에서 수정
  user
    .save()
    .then((userInfo) => res.status(200).json({ success: true })) //status(200) 통신 성공 이라는 뜻...!
    .catch((err) => res.json({ success: false, err }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
