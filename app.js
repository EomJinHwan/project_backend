const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {getUser, insertLoginHistory, insertUser, formatDate, check, encryptionPw} = require('./query.js');
const requestIp = require('request-ip');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 5000;

// app.use(cors()); //모든 접근 허용
app.use(cors({ origin: 'http://localhost:3000'}));  //특정 접근 허용
app.use(bodyParser.json());
app.use(requestIp.mw()); //아이피 주소 미들웨어

app.get('/', (req, res) => {
    res.send("hello, express!!!");
    console.log('get connect', req.data);
});

//로그인 
app.post('/login', async (req, res) => {
    const {id, pw} = req.body; // req.body에서 id, pw 추출
    const ip_address = req.clientIp; //클라이언트 ip 주소 추출
    //id 또는 pw가 없으면 오류 메시지 반환
    if(!id || !pw){
        res.status(400).send("아이디와 비밀번호를 모두 입력해주세요");
        return;
    }
    // 저장된 비밀번호 가져오기
    const storedPw = await getUser(id);
    // 아이디가 존재하지 않으면 오류 메시지 반환
    if(!storedPw){
        res.status(401).send("아이디가 존재하지 않습니다");
        return;
    }
    // 입력된 비밀번호와 저장된 비밀번호를 비교
    const isMatch = await bcrypt.compare(pw, storedPw);
    // 비밀번호가 일치하면 로그인 이력 기록 후 응답 반환
    if(isMatch){
        await insertLoginHistory(id, ip_address); // 로그인 이력 기록
        res.status(200).send("로그인 성공");
        return;
    } else{
        res.status(401).send("비밀번호가 일치하지 않습니다");
        return;
    }
});


//회원가입
app.post('/signUp', async (req, res) => {
    // 클라이언트로부터 받은 데이터에서 값을 추출
    const {user_id, user_pw, user_name, user_phone, user_birthDate} = req.body;
    //중복 체크 - 프론트 만들면 다시 봐야함
    const isDuplicate = await check(user_id);
        if (isDuplicate) {
            res.status(400).send("중복된 아이디입니다.");
            return;
        }
    // 필수 값이 모두 제공되었는지 확인
    if(!user_id || !user_pw || !user_name || !user_phone || !user_birthDate){
        res.status(400).send("값을 다 채워주세요");
        return;
    }
    // user_birthDate를 Date 객체로 변환
    const birthDate = new Date(user_birthDate)
    // 변환된 Date 객체가 유효한 날짜인지 확인
    if (isNaN(birthDate.getTime())) {
        res.status(400).send("잘못된 날짜 형식입니다.");
        return;
    }
     // Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
    const birth = formatDate(birthDate);
    // 비밀번호 암호화
    const encryption_pw = await encryptionPw(user_pw)
    // 사용자 정보를 데이터베이스에 삽입
    await insertUser(user_id, encryption_pw, user_name, user_phone, birth);
    res.status(201).send('회원가입 성공')
    return;
});

// 중복체크
app.post('/singUp/checkId', (req, res) => {
    const {user_id} = req.body;
    check(user_id, (error, isDuplicate) => {
        if (error) {
            // 오류 처리
            console.error("중복 체크 중 오류 발생:", error);
            res.status(500).json({ message: '서버 오류' });
        } else {
            // 중복 여부 json 형식으로 클라로 전송
            res.json({isDuplicate});
        }
    });
});

app.listen(port, ()=> {
    console.log(`${port}에서 대기중~~~`);
});