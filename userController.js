//userController.js
const userService = require('./userService.js');


//로그인
async function LoginRequest(req, res) {
    const { id, pw } = req.body;// req.body에서 id, pw 추출
    const ip_address = req.clientIp;// 클라이언트 ip 주소 추출

    try {
	    const result = await userService.login(id, pw, ip_address);
        res.status(result.status).json({ message: result.message });
      } catch (error){
            res.status(500).json({ message: "서버 오류가 발생했습니다" }); // 서버 오류 시 500 상태 코드
            console.error("로그인 실행중 오류 발생:", error); // 서버 로그에 에러 기록
        }
      
};

//아이디 중복 확인
async function checkUserIdDuplicate(req, res) {
    const userId = req.params.userId;
    try {
         const result = await userService.checkUserId(userId);
         console.log(`Check result for user ID ${userId}: ${result}`);
         res.status(200).json(result);
    } catch (error) {
        console.error("중복 체크 중 오류 발생:", error); // 서버 로그에 에러 기록
        res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
};

//회원가입
async function RegisterRequest(req, res) {
    // 클라이언트로부터 받은 데이터에서 값을 추출
    const { user_id, user_pw, user_name, user_phone, user_birthDate } = req.body;
    
    try{
        const result = await userService.register(user_id, user_pw, user_name, user_phone, user_birthDate);
        if(result.success){
            return res.status(200).json(false);
        } else {
            res.status(result.status).json({ message: result.message });
        }
    } catch (error) {
        console.error("회원가입 실행중 오류 발생:", error); // 서버 로그에 에러 기록
        return res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
    
};

// 아이디 찾기
// 비밀번호 찾기, 변경


module.exports = {
    LoginRequest,
    checkUserIdDuplicate,
    RegisterRequest,
};