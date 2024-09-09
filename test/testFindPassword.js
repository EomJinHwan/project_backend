//testFindPassword.js

// 모듈을 가져옵니다.
const { FindPassword } = require('../controllers/userController'); 

// 테스트 요청 및 응답 객체
const req = {
    body: {
        id: 'asdf',
        user_birthDate: '20240901',
        phone: '01011111111'
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