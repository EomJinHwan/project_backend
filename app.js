//app.js
//indxe.js 에 있던 모듈들 전부 옮기니깐 실행 되긴함
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');
const cookieParser = require('cookie-parser');
const { refreshJwtMiddleware } = require('./services/refreshToken.js');
const Router = require('./routers/Router.js');
//app.js
//네이버 연동 로그인
const client_id = "3WPCluuooCUJh9i7Rey1";
const client_secret = "AmliPbLGwe";
const state = "test";
const redirectURI = encodeURI("http://localhost:3000/callback");
const api_url = "";
const request = require('request');
//

const app = express();
const port = process.env.PORT || 5000;

// app.use(cors()); //모든 접근 허용
app.use(cors({ origin: 'http://localhost:3000' }));  //특정 접근 허용
app.use(bodyParser.json());
app.use(requestIp.mw()); //아이피 주소 미들웨어
app.use(cookieParser()); //쿠키 파서 미들웨어
app.use(refreshJwtMiddleware);// JWT 토큰을 자동으로 새로 고치는 미들웨어
app.use('/api', Router);

//네이버 연동 로그인
app.get('/naverlogin', (req, res) => {
    const api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&state=${state}`;
    res.status(200).json({ success: true, api_url: api_url });    
});

app.get('/callback', (req, res) => {
    const { code, state } = req.query;
    console.log(`code : ${code}, state : ${state}`);

    const api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`;
    const options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };

    request.get(options, (error, response, body) => {
        if (response) {
            console.log(`statusCode : ${response.statusCode}`);
            if (!error && response.statusCode == 200) {
                try {
                    const data = JSON.parse(body);
                    res.status(response.statusCode).json({ success: true, data });
                } catch (parseError) {
                    res.status(500).json({ success: false, message: "응답 데이터 파싱 오류" });
                    console.error("응답 데이터 파싱 중 오류 발생: ", parseError);
                }
            } else {
                res.status(response.statusCode).json({ success: false, message: "토큰을 가져오지 못했습니다" });
                console.log('error = ' + response.statusCode);
                console.log("토큰을 가져오는 중 오류 발생");
            }
        } else {
            res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
            console.error("네이버 로그인중 오류 발생: ", error);
        }
    });
});
//

app.get('/', (req, res) => {
    res.send("hello, express!!!");
    console.log('get connect', req.data);
});

app.listen(port, () => {
    console.log(`${port}에서 대기중~~~`);
});