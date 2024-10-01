// loginRouter.js
const express = require('express');
const router = express.Router();
const {LoginRequest} = require('../controllers/userController');

//로그인 요청 처리
router.post('/', LoginRequest);

module.exports = router;