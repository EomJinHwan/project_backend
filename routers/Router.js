// ./routers/Router.js
const express = require('express');
const router = express.Router();

const loginRouter = require('./loginRouter.js');
const signUpRouter = require('./signUpRouter.js');
const userRouter = require('./userRouter.js');

//로그인 라우터
router.use('/login', loginRouter);

//회원가입 라우터
router.use('/signUp', signUpRouter);

//유저 관련 라우터
router.post('/userRouter', userRouter);

//회원탈퇴
router.post('', RemoveUser);

module.exports = router;