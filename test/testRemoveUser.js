//testRemoveUser.js

// 모듈을 가져옵니다.
const { RemoveUser } = require('../controllers/userController'); //RemoveUser 들어있는 위치

// 테스트 요청 및 응답 객체
const req = {
    body: {
        userId: 'wlsghks'
    }
};

const res = {
    status: (code) => ({
        json: (message) => console.log(`Status: ${code}`, message)
    })
};

// 테스트 함수 실행
async function testRemoveUser() {
    await RemoveUser(req, res);
}

testRemoveUser();