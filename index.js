//서버의 시작점
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { User } = require("./models/User");

const config = require("./config/key"); //key 현재 환경을 읽어와서 mongoDB 접속 주소 어떻게 줄지 정함

const cookieParser = require("cookie-parser");

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

app.post("/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  // User.findOne({ email: req.body.email }, (err, user) => {
  //   if (!user) {
  //     return res.json({
  //       loginSuccess: false,
  //       message: "제공된 이메일에 해당하는 유저가 없습니다.",
  //     });
  //   }
  // });

  //위의 코드는 영상 강의 속 코드로 현재의 버전에서는 콜백 함수가 있지않다.
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // 결과를 담아줄 user명 선언
  //   const user = new User();
  //   User.findOne({ email: req.body.email })
  //     .then(user)
  //     .catch((err) =>
  //       res.json({
  //         loginSuccess: false,
  //         message: "제공된 이메일에 해당하는 유저가 없습니다.",
  //       })
  //     );

  //   //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
  //   user.comparePassword(req.body.password, (err, isMatch) => {
  //     if (!isMatch)
  //       return res.json({
  //         loginSuccess: false,
  //         message: "비밀번호가 틀렸습니다.",
  //       });

  //     //비밀번호까지 같다면 토큰을 생성하기.
  //     user.generateToken((err, user) => {
  //       if (err) return res.status(400).send(err);

  //       // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등등
  //       res
  //         .cookie("x_auth", user.token)
  //         .status(200)
  //         .json({ loginSuccess: true, userId: user._id });
  //     });
  //   });
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /////GPT가 수정한 코드 await/ async / promise의 작동을 잘 몰라서 
  //then, catch로 작성
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다.",
        });
      }

      // 비밀번호가 맞는지 확인.
      user
        .comparePassword(req.body.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.json({
              loginSuccess: false,
              message: "비밀번호가 틀렸습니다.",
            });
          }

          // 비밀번호가 맞다면 토큰을 생성하기.
          return user.generateToken();
        })
        .then((tokenUser) => {
          // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
          res
            .cookie("x_auth", tokenUser.token)
            .status(200)
            .json({ loginSuccess: true, userId: tokenUser._id });
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });

  /////
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
