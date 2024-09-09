//testLoginRequest.js

// 모듈을 가져옵니다.
const { LoginRequest } = require('../controllers/userController'); 

const req = {
    body : {
        id:'qqqq',
        pw:'qqqq'
    }
}

const res = {
    status : (code) => ({
        json: (message) => console.log(`Status: ${code}`, message)
    })
};

async function testLoginRequest() {
    await LoginRequest(req, res);
}

testLoginRequest();