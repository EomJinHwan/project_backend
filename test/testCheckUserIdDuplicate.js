//testCheckUserIdDuplicate.js

// 모듈을 가져옵니다.
const { CheckUserIdDuplicate } = require('../controllers/userController'); 

// 테스트 요청 및 응답 객체
const req = {
    params: {
        userId: 'qasdfsaffasdasdfs'
    }
};

const res = {
    status: (code) => ({
        json: (message) => console.log(`Status: ${code}`, message)
    })
};

// 테스트 함수 실행
async function testCheckUserIdDuplicate() {
    await CheckUserIdDuplicate(req, res);
}

testCheckUserIdDuplicate();