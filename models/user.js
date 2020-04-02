const mongoose = require('mongoose')

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

const User = mongoose.model('User', userSchema)

// 이 파일을 다른 파일에서도 사용하기 위해서
module.exports = { User }