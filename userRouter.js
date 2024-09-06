//userRouter.js
const express = require('express');
const router = express.Router();
const userController = require('./userController');

//로그인 라우터
router.post('/login', userController.LoginRequest);

//회원가입 라우터
router.post('/signUp', userController.RegisterRequest);

//아이디 중복확인 라우터
router.get('/signUp/:userId', userController.checkUserIdDuplicate);

module.exports = router;