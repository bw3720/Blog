/**
 * GPT가 작성한 로그인...
 */

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
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
});
