//서버의 시작점
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { User } = require("./models/User");

//바디파서 : 클라이언트에서 오는 정보를 서버에서 분석해서 들여올수있게 하는것
//application/x-www-form-urlencoded 해석
// app.use(bodyParser.urlencoded({ extended: true }));

// //application/json 해석
// app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  user
    .save()
    .then((userInfo) => res.status(200).json({ success: true }))    //status(200) 통신 성공 이라는 뜻...!
    .catch((err) => res.json({ success: false, err }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
