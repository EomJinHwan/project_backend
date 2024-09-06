require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const generateToken = async (userload) => {
    const token = await jwt.sign(userload, secretKey, {expiresIn: '1h'});
    return token;
}// jwt.sign() 메서드를 통해 jwt 토큰 발행. expiresIn : '1h' 설정으로 1시간 후 토큰이 만료되게 설정.

const refreshToken = async (token) => {
    try{
        // 기존 토큰의 유효성 검사 및 디코딩
        const decoded = jwt.verify(token, secretKey);
        
        // 새로운 페이로드 생성
        const userload = {
            userId: decoded.userId,
          };// 권한 제외하고 id만 

          const newToken = await generateToken(userload);
          return newToken;
    }catch (error) {
        // 토큰 새로 고침 중 오류 발생 시 출력
        console.error('토큰 새로 고침 중 오류 발생', error);
        return null;
    }
}

module.exports = {
    generateToken,
    refreshToken,
};