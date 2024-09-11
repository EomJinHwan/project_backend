// testFindUserId.js

// 모듈을 가져옵니다.
const { FindUserId } = require('../controllers/userController'); 

// 테스트 요청 및 응답 객체
const req = {
    body: {
        userBirthDate: '20240901', // yyyymmdd 형식의 날짜
        userPhone: '01000000000'
    }
};

const res = {
    status: (code) => ({
        json: (message) => console.log(`Status: ${code}`, message)
    })
};

// 테스트 함수 실행
async function testFindUserId() {
    await FindUserId(req, res);
}

testFindUserId();