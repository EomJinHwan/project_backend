//userController.js
const {insertUser, insertLoginHistory, getUser, formatDate, check, encryptionPw, findUser, getCurrentPw } = require('./query.js');
const bcrypt = require('bcrypt');
const { generateToken } = require('./jwt.js');
const secretKey = process.env.SECRET_KEY;

//로그인
async function LoginRequest(req, res) {
    const { id, pw } = req.body;// req.body에서 id, pw 추출
    const ip_address = req.clientIp;// 클라이언트 ip 주소 추출

    try {
        // id 또는 pw가 없으면 오류 메시지 반환
        if (!id || !pw) {
            return res.status(400).json({success:false, message: "아이디와 비밀번호를 모두 입력해주세요" });
        }

        // 저장된 비밀번호 가져오기
        const user = await getUser(id);

        // 아이디가 존재하지 않으면 오류 메시지 반환
        if (!user) {
            return res.status(401).json({success:false, message: "아이디가 존재하지 않습니다" });
        }

        // 입력된 비밀번호와 저장된 비밀번호를 비교
        const isMatch = await bcrypt.compare(pw, user.user_pw);

        // 비밀번호가 일치하면 로그인 이력 기록 후 응답 반환
        if (isMatch) {
            await insertLoginHistory(id, ip_address); // 로그인 이력 기록
            //토큰 - 프론트에 생기면 추가 
            // const userload = {
            //     userId : id
            // };
            // const token = await generateToken(userload);
    
            // res.cookie('token', token, {httpOnly: true, maxAge: 3600000});
            return res.status(200).json({success:true, message: "로그인 성공", name:user.name });
        } else {
            return res.status(401).json({success:false, message: "비밀번호가 일치하지 않습니다" });
        }
    } catch (error) {
        res.status(500).json({success:false, message: "서버 오류가 발생했습니다" }); // 서버 오류 시 500 상태 코드
        console.error("로그인 실행중 오류 발생:", error); // 서버 로그에 에러 기록
    }
};

//아이디 중복 확인
async function checkUserIdDuplicate(req, res) {
    const userId = req.params.userId;
    console.log(userId);
    try {
         // 중복 체크
         const isDuplicate = await check(userId);

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
    const { user_id, user_pw, user_name, user_phone, user_birthDate } = req.body;
    try{
        // 필수 값이 모두 제공되었는지 확인
        if (!user_id || !user_pw || !user_name || !user_phone || !user_birthDate) {
            return res.status(400).json({success:false, message: "빈칸을 다 채워주세요" });
        }

        // user_birthDate를 Date 객체로 변환
        const birthDate = new Date(user_birthDate);

        // 변환된 Date 객체가 유효한 날짜인지 확인
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({success:false, message: "잘못된 날짜 형식입니다." });
        }

        // Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
        const birth = formatDate(birthDate);

        // 비밀번호 암호화
        const encryption_pw = await encryptionPw(user_pw);

        // 사용자 정보를 데이터베이스에 삽입
        await insertUser(user_id, encryption_pw, user_name, user_phone, birth);
        
        return res.status(201).json({success:true, message:"회원가입 성공"});

    } catch (error) {
        console.error("회원가입 실행중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
    }
};

//아이디 찾기 - 생년월일, 핸드폰번호로 바꾸기
async function findUserId(req, res) {
    const {name, phone} = req.body;
    try {
        //사용자 아이디 찾기
        const userId = await findUser(name, phone);

        if(userId){
            //조건에 맞는 아이디 있으면 값 반환
            return res.status(200).json({success:true, message : "조건에 맞는 아이디가 있습니다", id:userId.user_id});
        }else{
            return res.status(400).json({success:false,message : "조건에 맞는 아이디가 없습니다"})
        }

    } catch (error) {
        console.error("아이디 찾기 중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
    }  
};

//비밀번호 찾기
async function findPassword(req, res) {
    const {id, name, phone } = req.body;
    try{
        const user = await findUser(id, name, phone);

        if(user){
            //해당 아이디가 있으면 토큰 생성
            const token = await generateToken(user.user_id);
            //조건에 맞는 아이디 있으면 값 반환
            return res.status(200).json({success:true,token, message : "조건에 맞는 아이디가 있습니다"});
        }else{
            return res.status(400).json({success:false,message : "조건에 맞는 아이디가 없습니다"})
        }

    } catch (error) {
        console.error("비밀번호 찾기 사용자 정보 확인 중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
    }
};

//비밀번호 변경
async function changePassword(req, res) {
    const{token, newPw} = req.body;
    try {
        //토큰 검증
        const decoded = jwt.verify(token, secretKey);

        if(decoded){
            //새로운 비밀번호 암호화
            const encryption_pw = await encryptionPw(newPw);

            //기존 비밀번호 조회
            const currentHashedPw = await getCurrentPw(decoded.id);

            //기존 비밀번호와 새 비밀번호 비교
            const isMatch = await bcrypt.compare(encryption_pw, currentHashedPw);

            if(isMatch){
                return res.status(400).json({success:false, message: "이전 비밀번호는 사용할 수 없습니다"});
            } else {
                //비밀번호 업데이트
                await updatePw(decoded.id, encryption_pw);
                return res.status(200).json({success:true, message: "비밀번호가 성공적으로 변경되었습니다"});
            }
        } else {
            return res.status(400).json({success:false, message : "유효하지 않은 토큰입니다"});
        }
    } catch (error) {
        console.error("비밀번호 변경 중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({success:false, message: "서버 오류가 발생했습니다" });
    }
};

module.exports = {
    LoginRequest,
    checkUserIdDuplicate,
    RegisterRequest,
    findUserId,
    findPassword,
    changePassword,
};