//userService
const {generateToken} = require('./jwt.js');
const query = require('./query.js');
const bcrypt = require('bcrypt');

class UserService{
    //로그인
    async login(id, pw, ip_address) {
        // id 또는 pw가 없으면 오류 메시지 반환
        if (!id || !pw) {
            return { status: 400, message: "아이디와 비밀번호를 모두 입력해주세요" };
        }
          
        // 저장된 비밀번호 가져오기
        const storedPw = await query.getUser(id);
        
        // 아이디가 존재하지 않으면 오류 메시지 반환
        if (!storedPw) {
            return { status: 404, message: "아이디가 존재하지 않습니다" };
        }
        
        // 입력된 비밀번호와 저장된 비밀번호를 비교
        const isMatch = await bcrypt.compare(pw, storedPw);
        
        // 비밀번호가 일치하면 로그인 이력 기록 후 응답 반환
        if (isMatch) {
            await query.insertLoginHistory(id, ip_address); // 로그인 이력 기록
        
            // const userload = {   -   프론트에서 토큰 만들면 주석풀고 체크해보기
            //     userId : id
            // };
            // const token = await generateToken(userload);
    
            // res.cookie('token', token, {httpOnly: true, maxAge: 3600000});
            
            return { status: 200, message: "로그인 성공" }; // 성공적인 결과를 반환
        } else {
            return { status: 401, message: "비밀번호가 일치하지 않습니다" };
        }
    };

    //회원가입
    async register(user_id, user_pw, user_name, user_phone, user_birthDate) {

        // 필수 값이 모두 제공되었는지 확인
        if (!user_id || !user_pw || !user_name || !user_phone || !user_birthDate) {
            return { status: 400, message: "빈칸을 다 채워주세요" };
        }

        // user_birthDate를 Date 객체로 변환
        const birthDate = new Date(user_birthDate);

        // 변환된 Date 객체가 유효한 날짜인지 확인
        if (isNaN(birthDate.getTime())) {
            return { status: 400, message: "잘못된 날짜 형식입니다." };
        }

        // Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
        const birth = query.formatDate(birthDate);
        
        // 비밀번호 암호화
        const encryption_pw = await query.encryptionPw(user_pw);

        // 사용자 정보를 데이터베이스에 삽입
        await query.insertUser(user_id, encryption_pw, user_name, user_phone, birth);
        return { success: true };
    };

    //아이디 중복 확인
    async checkUserId(userId){
        // 중복 체크
        const isDuplicate = await query.check(userId);

        if (isDuplicate) {
            // 중복된 아이디가 있을 때
            return true;
        } else{
            // 중복되지 않은 경우
            return false;
        }
    };
};

module.exports = new UserService();