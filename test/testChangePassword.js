//testChangePassword.js

// 모듈을 가져옵니다.
require('dotenv').config();
const { ChangePassword } = require('../controllers/userController');

// 테스트 요청 및 응답 객체
const req = {
    body: {
        userId: 'rkaqktm', // 테스트용 사용자 ID
        newPw: 'rkaqktm'// 새 비밀번호
    }
};

const res = {
    status: (code) => ({
        json: (message) => console.log(`Status: ${code}`, message)
    })
};

// 테스트 함수 실행
async function testChangePassword() {
    await ChangePassword(req, res);
}

testChangePassword();