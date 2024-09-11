//testRegisterRequest.js

// 모듈을 가져옵니다.
const { RegisterRequest } = require('../controllers/userController'); 

// 테스트 요청 및 응답 객체
const req = {
    body: {
        user_id: 'jjjj' ,
        user_pw: 'jjjj',
        user_name: 'jjjj',
        user_phone: '01055555555',
        user_birthDate: '1999-08-14'
    }
};

const res = {
    status: (code) => ({
        json: (message) => console.log(`Status: ${code}`, message)
    })
};

// 테스트 함수 실행
async function testRegisterRequest() {
    await RegisterRequest(req, res);
}

testRegisterRequest();