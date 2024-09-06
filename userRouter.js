//userRouter.js
const express = require('express');
const router = express.Router();
const {LoginRequest, checkUserIdDuplicate, RegisterRequest, findUserId, findPassword, changePassword } = require('./userController');

//로그인 라우터
router.post('/login', LoginRequest);

//회원가입 라우터
router.post('/signUp', RegisterRequest);

//아이디 중복확인 라우터
router.get('/signUp/:userId', checkUserIdDuplicate);

//아이디 찾기 라우터
router.post('', findUserId);

//비밀번호 찾기 라우터
router.post('', findPassword);

//비밀번호 변경 라우터
router.post('', changePassword);

module.exports = router;