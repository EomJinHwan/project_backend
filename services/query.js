// ./services/query.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

//회원가입
async function insertUser(user_id, user_pw, user_name, user_phone, user_birth){
    const query = "insert into member(user_id, user_pw, name, phone, birth, created_at) values(?,?,?,?,?,CURRENT_TIMESTAMP)";
    const values = [user_id, user_pw, user_name, user_phone, user_birth];

    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
            if(error){
                console.error("오류",error);
                return reject(error);
            }
            console.log("데이터 삽입 성공", results);
            return resolve(results);
        });
    })
};

//로그인 기록
async function insertLoginHistory(user_id, ip_address) {
    const query = "INSERT INTO login_history (user_id, ip_address, history) VALUES (?, ?, CURRENT_TIMESTAMP)";
    const values = [user_id, ip_address];
    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
            if (error) {
                console.error("오류", error);
                return reject(error);
            }
            console.log("데이터 삽입 성공", results);
                return resolve(results);
        });
    });
};

//ID 비교
async function getUser (user_id){
    const query = "SELECT user_pw, name FROM member WHERE user_id = ?";
    return new Promise((resolve, reject) => {
        pool.query(query, [user_id], (error, results) => {
            if (error) {
                console.error("오류", error);
                return reject(error);
            }
            if (results.length > 0) {
                resolve(results[0]); // 중복된 아이디가 있음
            } else {
                resolve(null); // 중복된 아이디가 없음
            }
        });
    });
};

//DATE 타입 변환 - date-picker
function formatDate(date){
    // 날짜가 제공되지 않은 경우 null을 반환
    if(!date) return null;  
     // 연도를 4자리 문자열로 가져오기
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0'); // 일
    // 'YYYY-MM-DD' 형식으로 날짜 문자열을 조합하여 반환
    return `${year}-${month}-${day}`;
}

//DATE 타입 변환 - yyyymmdd
function convertDateFormat(dateString) {
    // yyyymmdd 형식이 아닌 경우 null 반환
    if (!/^\d{8}$/.test(dateString)) return null;

    // 연도, 월, 일 추출
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    // 'yyyy-mm-dd' 형식으로 문자열 조합하여 반환
    return `${year}-${month}-${day}`;
}

//중복체크
async function check (user_id){
    const query = "SELECT user_id FROM member WHERE user_id = ?";
    return new Promise((resolve, reject) => {
        pool.query(query, [user_id], (error, results) => {
            if (error) {
                console.error("중복 체크 오류", error);
                return reject(error);
            }
            if (results.length > 0) {
                resolve(false); // 중복된 아이디가 있음 - 프론트 에 주는 값
            } else {
                resolve(true); // 중복된 아이디가 없음
            }
        });
    });
};

//비밀번호 암호화
async function encryptionPw(userPw) {
    try{
        // 비밀번호 암호화를 위한 salt 생성
        const salt = await bcrypt.genSalt(10);
        // 생성된 salt를 사용하여 비밀번호를 해시화
        const hash_pw = await bcrypt.hash(userPw, salt);
        return hash_pw; // 해시화된 비밀번호 반환
    } catch (error){
        console.error("오류", error);
        // 암호화 오류를 상위 호출자에게 전달
        throw new Error("비밀번호 암호화 오류");
    }
};

//아이디 찾기
async function findUser(user_id = null, birth = null, phone){
    let query
    let values

    if(user_id){
        query = "SELECT user_id FROM member WHERE user_id = ? AND phone=?";
        values = [user_id, phone];
    }else{
        query = "SELECT user_id FROM member WHERE birth=? AND phone=?";
        values = [birth, phone];
    }
    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
            if (error) {
                console.error("오류", error);
                return reject(error);
            }
            if (results.length > 0) {
                resolve(results[0].user_id); // 아이디 찾기 성공
            } else {
                resolve(null); // 조건에 맞는 아이디 없음 
            }
        });
    });
};

//비밀번호 조회
async function getCurrentPw(user_id) {
    const query = "SELECT user_pw FROM member WHERE user_id = ?"
    const values = [user_id];
    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
            if (error) {
                console.error("기존 비밀번호 조회 오류", error);
                return reject(error);
            }
            if (results.length > 0) {
                resolve(results[0].user_pw); // 비밀번호 찾기 성공
            } else {
                resolve(null); // 조건에 맞는 비밀번호 없음 
            }
        });
    });
};

//비밀번호 변경
async function updatePw(userId, newPw) {
    try{
        console.log(`Updating password for userId: ${userId} with newPw: ${newPw}`);
        const query = "UPDATE member SET user_pw = ? WHERE user_id = ?";
        const values = [newPw, userId];
        return new Promise((resolve, reject) => {
            pool.query(query, values, (error, results) => {
                if (error) {
                    console.error("비밀번호 업데이트 오류", error);
                    return reject(error);
                }
                console.log("데이터 삽입 성공", results);
                console.log(`Rows matched: ${results.affectedRows}`);
                return resolve(results);
            });
        });
    }catch (error) {
        console.error("비밀번호 변경 오류:", error.message);
        throw error;
    }
};


module.exports = {
    insertUser,
    insertLoginHistory,
    getUser,
    formatDate,
    check,
    encryptionPw,
    findUser,
    updatePw,
    getCurrentPw,
    convertDateFormat,
};