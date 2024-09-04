//userService
const {generateToken} = require('./jwt.js');
const {getUser, insertLoginHistory} = require('./query.js');
const bcrypt = require('bcrypt');

class UserService{
    async login(req, res) {

        const { id, pw } = req.body; // req.body에서 id, pw 추출
        const ip_address = req.clientIp; // 클라이언트 ip 주소 추출
        
        // id 또는 pw가 없으면 오류 메시지 반환
        if (!id || !pw) {
            return res.status(400).json({ message: "아이디와 비밀번호를 모두 입력해주세요" });
        }
        
        // 저장된 비밀번호 가져오기
        const storedPw = await getUser(id);
        
        // 아이디가 존재하지 않으면 오류 메시지 반환
        if (!storedPw) {
            return res.status(401).json({ message: "아이디가 존재하지 않습니다" });
        }
        
        // 입력된 비밀번호와 저장된 비밀번호를 비교
        const isMatch = await bcrypt.compare(pw, storedPw);
        
        // 비밀번호가 일치하면 로그인 이력 기록 후 응답 반환
        if (isMatch) {
            await insertLoginHistory(id, ip_address); // 로그인 이력 기록
        
            const userload = {
                userId : id
            };
            const token = await generateToken(userload);
    
            res.cookie('token', token, {httpOnly: true, maxAge: 3600000});
            
            return res.status(200).json({ message: "로그인 성공" });
        } else {
            return res.status(401).json({ message: "비밀번호가 일치하지 않습니다" });
        }
    };
}

module.exports = new UserService();