//testFindPassword.js

// 모듈을 가져옵니다.
const { FindPassword } = require('../controllers/userController'); 

// 테스트 요청 및 응답 객체
const req = {
    body: {
        userId: 'rkaqktm',
        userPhone: '01000000000'
    }
};

const res = {
    status: (code) => ({
        json: (message) => console.log(`Status: ${code}`, message)
    })
};

// 테스트 함수 실행
async function testFindPassword() {
    await FindPassword(req, res);
}

testFindPassword();