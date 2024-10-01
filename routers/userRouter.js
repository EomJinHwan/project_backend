// userRouter.js
const express = require('express');
const router = express.Router();
const { FindUserId, FindPassword, ChangePassword } = require('../controllers/userController');

//아이디 찾기 라우터
router.post('/findId', FindUserId);

//비밀번호 찾기 라우터
router.post('/findPw', FindPassword);

//비밀번호 변경 라우터
router.post('/changePw', ChangePassword);

module.exports = router;