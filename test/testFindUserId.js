// testFindUserId.js

// 모듈을 가져옵니다.
const { findUserId } = require('../controllers/userController'); 

// 테스트 요청 및 응답 객체
const req = {
    body: {
        user_birthDate: '20240908', // yyyymmdd 형식의 날짜
        phone: '01077777777'
    }
};

const res = {
    status: (code) => ({
        json: (message) => console.log(`Status: ${code}`, message)
    })
};

// 테스트 함수 실행
async function testFindUserId() {
    await findUserId(req, res);
}

testFindUserId();