const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim : true, // john a@naver.com -> johna@naver.com 공백을 없애주는 역할
        unique : 1  // 똑같은 이메일을 쓰지 못하게 고유했으면 할 때 설정
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 어떤 유저가 일반, 관리자가 될 수도 있죠
        type: Number,
        default: 0
    },
    image: String,
    token: { // 유효성 관리
        type: String
    },
    tokenExp:{ // 토큰의 유효 기간 설정
        type: Number
    } 
})

userSchema.pre('save', function(next){
    var user = this

    if(user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password ,salt  , function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()

            })
        })
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 1234567를 암호화해서  db에 있는 암호화된 비밀번호랑 맞는지 체크
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch )
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기

    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user._id + 'secrectToken' = token
    // ->
    // 'secretToken' -> user._id
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode 한다.
    
    jwt.verify(token,'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token }, function(err, user){

            if(err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User', userSchema)

// 이 파일을 다른 파일에서도 사용하기 위해서
module.exports = { User }