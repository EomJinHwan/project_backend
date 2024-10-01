//testSendSMS.js

// 모듈을 가져옵니다.
const { sendSMS } = require('../controllers/smsController');

// 테스트 요청 및 응답 객체
const req = {
    body: {
        userPhone: "01075344448",
    }
};

const res = {
    status: (code) => ({
        json: (message) => console.log(`Status: ${code}`, message)
    })
};

// 테스트 함수 실행
async function testSendSMS() {
    await sendSMS(req, res);
}

testSendSMS();