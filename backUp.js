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

  // 결과를 담아줄 user명 선언
  const user = new User();
  User.findOne({ email: req.body.email })
    .then(user)
    .catch((err) =>
      res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      })
    );

  //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
  user.comparePassword(req.body.password, (err, isMatch) => {
    if (!isMatch)
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });

    //비밀번호까지 같다면 토큰을 생성하기.
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);

      // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등등
      res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
    });
  });
});
