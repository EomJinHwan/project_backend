// naverRouter.js
const express = require('express');
const router = express.Router();
const {naverlogin, callback} = require('../controllers/naverController');

router.get('/naverlogin', naverlogin);

router.get('/callback', callback);

module.exports = router;