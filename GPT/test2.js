const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  const user = this;
  const token = jwt.sign({ _id: user._id.toHexString() }, "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = mongoose.model("User", userSchema);

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

      // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인.
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) return res.status(400).send(err);

        if (!isMatch) {
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다.",
          });
        }

        // 비밀번호가 맞다면 토큰을 생성하기.
        user.generateToken((err, userWithToken) => {
          if (err) return res.status(400).send(err);

          // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
          res
            .cookie("x_auth", userWithToken.token)
            .status(200)
            .json({ loginSuccess: true, userId: userWithToken._id });
        });
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
