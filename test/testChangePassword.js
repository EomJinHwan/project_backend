//testChangePassword.js

// 모듈을 가져옵니다.
require('dotenv').config();
const { ChangePassword } = require('../controllers/userController');
const { generateToken } = require('../services/jwt');

// 테스트 요청 및 응답 객체
const userId = 'pppp'; // 테스트용 사용자 ID
const newPassword = 'pppp'; // 새 비밀번호

// 테스트 함수 실행
async function testChangePassword() {

const userload ={
    userId: userId
}
const token = await generateToken(userload);

const req = {
    body: {
        token: token,
        newPw: newPassword
    }
};

const res = {
    status: (code) => ({
        json: (message) => console.log(`Status: ${code}`, message)
    })
};
    await ChangePassword(req, res);
}

testChangePassword();