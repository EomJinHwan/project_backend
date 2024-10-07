//app.js
//indxe.js 에 있던 모듈들 전부 옮기니깐 실행 되긴함
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');
const cookieParser = require('cookie-parser');
const { refreshJwtMiddleware } = require('./services/refreshToken.js');
const Router = require('./routers/Router.js');

const app = express();
const port = process.env.PORT || 5000;

// app.use(cors()); //모든 접근 허용
app.use(cors({ origin: 'http://localhost:3000', credentials: true, }));  //특정 접근 허용
app.use(bodyParser.json());
app.use(requestIp.mw()); //아이피 주소 미들웨어
app.use(cookieParser()); //쿠키 파서 미들웨어
app.use(refreshJwtMiddleware);// JWT 토큰을 자동으로 새로 고치는 미들웨어
app.use('/api', Router);



app.get('/', (req, res) => {
    res.send("hello, express!!!");
    console.log('get connect', req.data);
});

app.listen(port, () => {
    console.log(`${port}에서 대기중~~~`);
});