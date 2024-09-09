// ./services/refreshToken.js
const {refreshToken} = require('./jwt.js');
const secretKey = process.env.SECRET_KEY;

// JWT 토큰을 새로 고치는 미들웨어 함수
const refreshJwtMiddleware = async (req, res, next) => {
    // 요청으로부터 쿠키의 토큰 정보 가져오기
    const token = req.cookies.token;

     // 토큰이 존재하는 경우
     if (token) {
        try {
            // 토큰을 검증하고 디코딩
            const decoded = jwt.verify(token, secretKey);
            const expiryTime = decoded.exp; // 토큰의 만료 시간

            // 현재 시간을 가져와서 만료 여부를 확인
            const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로
            if (expiryTime - currentTime < 60 * 60) { // 만료 시간이 1시간 이하 남았는지 확인

                // 토큰을 새로고침하고 새 토큰을 가져옴
                const newToken = await refreshToken(token);
                // 새 토큰이 있다면 쿠키에 저장
                if (newToken) {
                    res.cookie('token', newToken, { httpOnly: true, maxAge: 3600000 }); // 새 토큰을 쿠키에 저장
                }
            }
        } catch (err) {
            // 토큰이 유효하지 않거나 검증 실패 시 처리
            console.error('Token verification failed:', err);
        }
    }
     
    // 다음 미들웨어로 이동
    next();
};

module.exports = {
    refreshJwtMiddleware,
};