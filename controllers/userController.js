// ./controllers/userController.js
const {insertUser, insertLoginHistory, getUser, formatDate, check, encryptionPw, findUser, getCurrentPw, convertDateFormat, updatePw, myPage } = require('../services/query.js');
const bcrypt = require('bcrypt');
const { generateToken } = require('../services/jwt.js');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

//로그인
async function LoginRequest(req, res) {
    const { userId, userPw } = req.body;// req.body에서 id, pw 추출
    const ip_address = req.clientIp;// 클라이언트 ip 주소 추출
    console.log(`userId : ${userId}, userPw : ${userPw}, ip : ${ip_address}`);

    try {
        // id 또는 pw가 없으면 오류 메시지 반환
        if (!userId || !userPw) {
            return res.status(400).json({success:false, message: "아이디와 비밀번호를 모두 입력해주세요" });
        }

        // 저장된 비밀번호 가져오기
        const user = await getUser(userId);
        console.log(`user : ${JSON.stringify(user)}`);

        // 아이디가 존재하지 않으면 오류 메시지 반환
        if (!user) {
            return res.status(401).json({success:false, message: "아이디가 존재하지 않습니다" });
        }

        // 입력된 비밀번호와 저장된 비밀번호를 비교
        const isMatch = await bcrypt.compare(userPw, user.user_pw);
        console.log(`isMatch : ${isMatch}`);

        // 비밀번호가 일치하면 로그인 이력 기록 후 응답 반환
        if (isMatch) {
            await insertLoginHistory(userId, ip_address); // 로그인 이력 기록  

            return res.status(200).json({success:true, message: "로그인 성공", name:user.name , id:userId}); 
        } else {
            return res.status(401).json({success:false, message: "비밀번호가 일치하지 않습니다" });
        }
    } catch (error) {
        res.status(500).json({success:false, message: "서버 오류가 발생했습니다" }); // 서버 오류 시 500 상태 코드
        console.error("로그인 실행중 오류 발생:", error); // 서버 로그에 에러 기록
    }
};

//아이디 중복 확인
async function CheckUserIdDuplicate(req, res) {
    const userId = req.params.userId;
    console.log(`userId : ${userId}`);
    
    try {
         // 중복 체크
         const isDuplicate = await check(userId);
         console.log(`isDupliacte : ${isDuplicate}`);

         if (!isDuplicate) {
             // 중복된 아이디가 있을 때
             return res.status(200).json({success:false, message:"중복된 아이디 입니다"});
         } else{
             // 중복되지 않은 경우
             return res.status(200).json({success:true, message:"사용가능 아이디 입니다"});
         }
    } catch (error) {
        console.error("중복 체크 중 오류 발생:", error); // 서버 로그에 에러 기록
        res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
    }
};

//회원가입
async function RegisterRequest(req, res) {
    // 클라이언트로부터 받은 데이터에서 값을 추출
    const { userId, userPw, userName, userPhone, userBirthDate } = req.body;
    console.log(`user_id : ${userId}, user_pw : ${userPw}, user_name : ${userName}, user_phone : ${userPhone}, user_birthDate : ${userBirthDate}`);
    try{
        // 필수 값이 모두 제공되었는지 확인
        if (!userId || !userPw || !userName || !userPhone || !userBirthDate) {
            return res.status(400).json({success:false, message: "빈칸을 다 채워주세요" });
        }

        // user_birthDate를 Date 객체로 변환
        const birthDate = new Date(userBirthDate);
        console.log(`birthDate : ${birthDate}`);

        // 변환된 Date 객체가 유효한 날짜인지 확인
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({success:false, message: "잘못된 날짜 형식입니다." });
        }

        // Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
        const birth = formatDate(birthDate);
        console.log(`birth : ${birth}`);

        // 비밀번호 암호화
        const encryption_pw = await encryptionPw(userPw);
        console.log(`encryption_pw : ${encryption_pw}`);

        // 사용자 정보를 데이터베이스에 삽입
        await insertUser(userId, encryption_pw, userName, userPhone, birth);
        
        return res.status(201).json({success:true, message:"회원가입 성공"});
    } catch (error) {
        console.error("회원가입 실행중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
    }
};

//아이디 찾기
async function FindUserId(req, res) {
    const {userBirthDate, userPhone} = req.body;
    console.log(`user_birthDate : ${userBirthDate}, phone : ${userPhone}`);

    try {
        //생년월일 yyyymmdd 로 변환
        const birth = convertDateFormat(userBirthDate);
        console.log(`birth : ${birth}`);

        if(birth){
            //사용자 아이디 찾기
            const userId = await findUser(null, birth, userPhone);
            console.log(`userId : ${userId}`);

            if(userId){
                //조건에 맞는 아이디 있으면 값 반환
                return res.status(200).json({success:true, message : "조건에 맞는 아이디가 있습니다", userId:userId});
             } else {
                return res.status(400).json({success:false, message : "조건에 맞는 아이디가 없습니다"});
            }
        } else {
            return res.status(400).json({success:false, message : "날짜를 형식에 맞게 입력해 주세요"});
        }
    } catch (error) {
        console.error("아이디 찾기 중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
    }  
};

//비밀번호 찾기
async function FindPassword(req, res) {
    const {userId, userPhone} = req.body;
    console.log(`id : ${userId}, phone : ${userPhone}`);

    try{
        const user = await findUser(userId, null, userPhone);
        console.log(`user : ${userId}`);

        if(user){
            //조건에 맞는 아이디 있으면 값 반환
            console.log("조건에 맞는 아이디 있음");
            return res.status(200).json({success:true, message : "조건에 맞는 아이디가 있습니다"});
        }else{
            console.log("조건에 맞는 아이디 없음");
            return res.status(400).json({success:false,message : "조건에 맞는 아이디가 없습니다"})
        }
    } catch (error) {
        console.error("비밀번호 찾기 사용자 정보 확인 중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
    }
};

//비밀번호 변경
async function ChangePassword(req, res) {
    const{userId, newPw} = req.body;
    console.log(`userId : ${userId}, newPw : ${newPw}`);

    try {
        //유저 확인
        const user = await check(userId); //check 함수로 중복된 아이디가 있으면 false 반환
        console.log(`user : ${user}`);

        if(!user){
            //기존 비밀번호 조회
            const currentHashedPw = await getCurrentPw(userId);
            console.log(`currentHashedPw : ${currentHashedPw}`);

            //기존 비밀번호와 새 비밀번호 비교
            const isMatch = await bcrypt.compare(newPw, currentHashedPw);
            console.log(`isMatch : ${isMatch}`);

            //새로운 비밀번호 암호화
            const encryption_pw = await encryptionPw(newPw);
            console.log(`encryption_pw : ${encryption_pw}`);

            if(isMatch){
                console.log("동일한 비밀번호")
                return res.status(400).json({success:false, message: "이전 비밀번호는 사용할 수 없습니다"});
            } else {
                //비밀번호 업데이트
                console.log("사용가능 비밀번호")
                await updatePw(userId, encryption_pw);
                return res.status(200).json({success:true, message: "비밀번호가 성공적으로 변경되었습니다"});
            }
        } else {
            return res.status(400).json({success:false, message : "아이디 정보가 없습니다"});
        }
    } catch (error) {
        console.error("비밀번호 변경 중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
    }
};


module.exports = {
    LoginRequest,
    CheckUserIdDuplicate,
    RegisterRequest,
    FindUserId,
    FindPassword,
    ChangePassword,
};