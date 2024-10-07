//naverController.js
const fetch = require('node-fetch');
const pool = require('../config/db.js'); //connetion

const client_id = "본인 ID";
const client_secret = "본인 SECRET KEY";
const state = "test"; //임의로 지정
const redirectURI = encodeURI("http://localhost:5000/api/callback");
const api_url = "";

//네이버 연동 로그인
async function naverlogin(req, res) {
    console.log("hi");
    const api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&state=${state}`;
    res.status(200).json({ success: true, api_url: api_url });
};

async function callback(req, res) {
    const { code, state } = req.query; // 쿼리 파라미터에서 code와 state 추출
    const ip_address = req.clientIp;
    console.log(`code : ${code}, state : ${state}`);

    // 네이버 API에 액세스 토큰 요청 URL
    const api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`;

    try {
        // 토큰 요청
        const response = await fetch(api_url, {
        });

        // 응답 상태 체크
        if (!response.ok) {
            console.error('Failed to fetch token:', response.status);
            return res.status(response.status).json({ success: false, message: "토큰을 가져오지 못했습니다" });
        }

        const tokenRequest = await response.json(); // 응답 JSON 파싱
        console.log("tokenRequest:", tokenRequest);

        // access_token 존재 여부 체크
        if ("access_token" in tokenRequest) {
            const { access_token } = tokenRequest; // access_token 추출
            const apiUrl = "https://openapi.naver.com/v1/nid/me"; // 사용자 정보 요청 URL

            // 사용자 정보 요청
            const data = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${access_token}`, // 토큰을 Authorization 헤더에 포함
                },
            });

            // 응답 상태 체크
            if (!data.ok) {
                console.error('Failed to fetch user data:', data.status);
                return res.status(data.status).json({ success: false, message: "사용자 데이터를 가져오지 못했습니다" });
            }

            const userData = await data.json(); // 사용자 정보 JSON 파싱
            console.log("userData : ", userData);

            // 사용자 존재 여부 체크
            const { id, name, mobile, birthday, birthyear } = userData.response;
            const birthDate = `${birthyear}-${birthday}`;
            const userPhone = mobile.replace(/-/g, '');
            console.log("userPhone : ", userPhone);

            const queryCheck = 'SELECT * FROM snsmember WHERE user_id = ?';
            pool.query(queryCheck, [id], (error, results) => {
                if (error) {
                    console.error('DB Query Error:', error);
                    return res.status(500).json({ success: false, message: "서버 오류 발생" });
                }
                if (results.length === 0) {
                    // 사용자가 존재하지 않는 경우에만 삽입
                    const pw = userPhone;   // 임시비밀번호를 폰번호로 사용
                    const queryInsert = 'INSERT INTO snsmember (user_id, user_pw, name, phone, birth, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
                    const values = [id, pw, name, userPhone, birthDate];

                    pool.query(queryInsert, values, (insertError) => {
                        if (insertError) {
                            console.error('DB Insert Error:', insertError);
                            return res.status(500).json({ success: false, message: "회원가입 중 오류 발생" });
                        }
                        console.log('회원가입됨');
                    });
                }

                const historyquery = "INSERT INTO login_history (user_id, ip_address, history) VALUES (?, ?, CURRENT_TIMESTAMP)";
                const values = [id, ip_address];
                pool.query(historyquery, values, (error) => {
                    if (error) {
                        console.error('DB Insert Error:', error);
                        return res.status(500).json({ success: false, message: "로그 기록 중 오류 발생" });
                    }
                    console.log("로그 기입 됨")
                })

                return res.send(`
                    <script>
                        // userData를 여기서 정의합니다. 예시입니다.
                        const userData = ${JSON.stringify(userData)};
                        window.opener.postMessage({ userData: userData }, 'http://localhost:3000');
                        window.close();
                    </script>
                `);
            });
        } else {
            return res.status(400).json({ success: false, message: "access_token이 없습니다" });
        }
    } catch (error) {
        console.error("Error fetching token:", error);
        return res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
};


module.exports = {
    naverlogin,
    callback,
}
