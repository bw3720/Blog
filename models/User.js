const mongoose = require("mongoose");

const bcrypt = require("bcrypt"); //암호화 (https://www.npmjs.com/package/bcrypt) 사용법
const saltRounds = 10;

const jwt = require("jsonwebtoken"); //토큰 생성 (https://www.npmjs.com/package/jsonwebtoken) 사용법

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 50,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//userSchema.pre ~~를 하기전에 타는 함수 정의
userSchema.pre("save", function (next) {
  //비밀번호를 암호화 시킨다.

  var user = this; //위의 userSchema 정보 불러오기

  //비밀번호가 수정되었다면...
  if (user.isModified("password")) {
    //암호화에 필요한 salt 생성
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      //salt를 사용하여 비밀번호 암호화
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash; //암호화 된 비밀번호를 기존에 비밀번호에 덮어씌우기
        next();
      });
    });
  } else {
    //비밀번호 수정이 아니라면 그냥 나가기
    next();
  }
});

// userSchema.methods.comparePassword = function (plainPassword, cb) {
//   //plainPassword : 1234567   암호화된 비밀번호 : $2b$10$j3rFhgKO8iiHeqCOgA/FEu/XQ2eMChNUnh0BSRuEKq488cZJWsuVC
//   bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

// userSchema.methods.generateToken = function (cb) {
//   var user = this;

//   //jsonwebtoken을 사용해서 토큰 생성
//   /**
//    * user._id + secretToken = 토큰 생성
//    *
//    * =>
//    *
//    *  secretToken => user._id
//    */
//   var token = jwt.sign(user._id.toHexString(), "secretToken");

//   //   user.token = token;
//   //   user.save(function (err, user) {
//   //     if (err) return cb(err);
//   //     cb(null, user);
//   //   });

//   user
//     .save()
//     .then(cb(null, user))
//     .catch((err) => cb(err));
// };

/////////////////////GPT
// userSchema.methods.comparePassword = function(plainPassword) {
//     return new Promise((resolve, reject) => {
//       bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
//         if (err) return reject(err);
//         resolve(isMatch);
//       });
//     });
//   };

// userSchema.methods.generateToken = function() {
//     return new Promise((resolve, reject) => {
//       const user = this;
//       // 토큰 생성 로직 예제
//       const token = jwt.sign(user._id.toHexString(), 'secretToken');
//       user.token = token;
//       user.save((err, user) => {
//         if (err) return reject(err);
//         resolve(user);
//       });
//     });
//   };
/////////////////////

///////GPT 구현부
userSchema.methods.comparePassword = function(plainPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return reject(err);
        resolve(isMatch);
      });
    });
  };
  
  userSchema.methods.generateToken = function() {
    const user = this;
    return new Promise((resolve, reject) => {
      const token = jwt.sign({ _id: user._id.toHexString() }, 'secretToken');
      user.token = token;
      user.save()
        .then(user => resolve(user))
        .catch(err => reject(err));
    });
  };
////////////////
const User = mongoose.model("User", userSchema); //schema를 model로 감싼다.

module.exports = { User };
