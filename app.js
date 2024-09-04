const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {insertUser, formatDate, check, encryptionPw, findUser} = require('./query.js');
const requestIp = require('request-ip');
const cookieParser = require('cookie-parser');
const { refreshJwtMiddleware } = require('./refreshToken.js');
const userService = ('./userService.js');


const app = express();
const port = process.env.PORT || 5000;

// app.use(cors()); //모든 접근 허용
app.use(cors({ origin: 'http://localhost:3000'}));  //특정 접근 허용
app.use(bodyParser.json());
app.use(requestIp.mw()); //아이피 주소 미들웨어
app.use(cookieParser()); //쿠키 파서 미들웨어
app.use(refreshJwtMiddleware);// JWT 토큰을 자동으로 새로 고치는 미들웨어


app.get('/', (req, res) => {
    res.send("hello, express!!!");
    console.log('get connect', req.data);
});

//로그인 
app.post('/login', async (req, res)  => {
    try {
	await userService.login(req, res);
      } catch (error){
        console.error("로그인 실행중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({ message: "서버 오류가 발생했습니다" });
      }
});

//아이디 중복 확인
app.get(`/signUp/:userId`, async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    try {
        // 중복 체크
        const isDuplicate = await check(userId);

        if (isDuplicate) {
            // 중복된 아이디가 있을 때
            return res.status(200).json(true);
        } else{
            // 중복되지 않은 경우
            return res.status(200).json(false);
        }
    } catch (error) {
        console.error("중복 체크 중 오류 발생:", error); // 서버 로그에 에러 기록
        res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
});


//회원가입
app.post('/signUp', async (req, res) => {
    try {
        // 클라이언트로부터 받은 데이터에서 값을 추출
        const { user_id, user_pw, user_name, user_phone, user_birthDate } = req.body;

        // 필수 값이 모두 제공되었는지 확인
        if (!user_id || !user_pw || !user_name || !user_phone || !user_birthDate) {
            return res.status(400).json({ message: "빈칸을 다 채워주세요" });
        }

        // user_birthDate를 Date 객체로 변환
        const birthDate = new Date(user_birthDate);

        // 변환된 Date 객체가 유효한 날짜인지 확인
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({ message: "잘못된 날짜 형식입니다." });
        }

        // Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
        const birth = formatDate(birthDate);

        // 비밀번호 암호화
        const encryption_pw = await encryptionPw(user_pw);

        // 사용자 정보를 데이터베이스에 삽입
        await insertUser(user_id, encryption_pw, user_name, user_phone, birth);
        //return res.status(201).json({ message: '회원가입 성공' });
        return res.status(201).json(false);
    } catch (error) {
        console.error("회원가입 실행중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
});

//아이디 찾기
app.post('', async (req, res) => {
    try{
        const {name, phone} = req.body;
        //사용자 아이디 찾기
        const userId = await findUser(name, phone);

        if(userId){
            //조건에 맞는 아이디 있으면 값 반환
            return res.status(200).json({userId, message : "조건에 맞는 아이디가 있습니다"});
        }else{
            return res.status(400).json({message : "조건에 맞는 아이디가 없습니다"})
        }
    }catch (error){
        console.error("아이디 찾기 중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
});

//비밀번호 찾기 - 사용자 정보 확인
app.post('', async (req, res) => {
    try{
        const {id, name, phone} = req.body;
        //사용자 아이디 찾기
        const userPw = await findUser(id, name, phone);

        if(userPw){
            //조건에 맞는 아이디 있으면 값 반환
            return res.status(200).json({userId, message : "조건에 맞는 아이디가 있습니다"});
        }else{
            return res.status(400).json({message : "조건에 맞는 아이디가 없습니다"})
        }
    }catch (error){
        console.error("비밀번호 찾기 사용자 정보 확인 중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
});



app.listen(port, ()=> {
    console.log(`${port}에서 대기중~~~`);
});