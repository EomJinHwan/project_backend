// ./routers/Router.js
const express = require('express');
const router = express.Router();

const loginRouter = require('./loginRouter');
const signUpRouter = require('./signUpRouter');
const userRouter = require('./userRouter');
const naverRouter = require('./naverRouter');

//로그인 라우터
router.use('/login', loginRouter);

//회원가입 라우터
router.use('/signUp', signUpRouter);

//유저 관련 라우터
router.use('/userRouter', userRouter);

//네이버 관련 라우터
router.use('', naverRouter); //비워둬야 작

module.exports = router;
