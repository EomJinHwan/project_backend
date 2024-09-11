// ./routers/userRouter.js
const express = require('express');
const router = express.Router();
const {LoginRequest, CheckUserIdDuplicate, RegisterRequest, FindUserId, FindPassword, ChangePassword } = require('../controllers/userController');

//로그인 라우터
router.post('/login', LoginRequest);

//회원가입 라우터
router.post('/signUp', RegisterRequest);

//아이디 중복확인 라우터
router.get('/signUp/:userId', CheckUserIdDuplicate);

//아이디 찾기 라우터
router.post('/findId', FindUserId);

//비밀번호 찾기 라우터
router.post('/findPw', FindPassword);

//비밀번호 변경 라우터
router.post('/changePw', ChangePassword);


module.exports = router;