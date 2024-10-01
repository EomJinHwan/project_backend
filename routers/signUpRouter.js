// signUpRouter.js
const express = require('express');
const router = express.Router();
const {CheckUserIdDuplicate, RegisterRequest} = require('../controllers/userController');
const {sendSMS, verifyCode} = require('../controllers/smsController');

//회원가입 라우터
router.post('/', RegisterRequest);

//아이디 중복 확인 라우터
router.get('/checkId/:userId', CheckUserIdDuplicate);

//SMS문자 인증 라우터
router.post('/sendSMSCode', sendSMS);

//인증번호 확인 라우터
router.post('/verifyCode', verifyCode);

module.exports = router;