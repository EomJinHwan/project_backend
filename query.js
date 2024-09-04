const { hashSync, genSaltSync } = require('bcryptjs');
const pool = require('./db');
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
async function insertLoginHistory(id, ip_address) {
    const query = "INSERT INTO login_history (user_id, ip_address, history) VALUES (?, ?, CURRENT_TIMESTAMP)";
    const values = [id, ip_address];
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
async function getUser (id){
    const query = "SELECT user_pw FROM member WHERE user_id = ?";
    return new Promise((resolve, reject) => {
        pool.query(query, [id], (error, results) => {
            if (error) {
                console.error("오류", error);
                return reject(error);
            }
            if (results.length > 0) {
                resolve(results[0].user_pw); // 중복된 아이디가 있음
            } else {
                resolve(null); // 중복된 아이디가 없음
            }
        });
    });
};

//DATE 타입 변환
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

//중복체크
async function check (id){
    const query = "SELECT user_id FROM member WHERE user_id = ?";
    return new Promise((resolve, reject) => {
        pool.query(query, [id], (error, results) => {
            if (error) {
                console.error("중복 체크 오류", error);
                return reject(error);
            }
            if (results.length > 0) {
                resolve(true); // 중복된 아이디가 있음 - 프론트 에 주는 값
            } else {
                resolve(false); // 중복된 아이디가 없음
            }
        });
    });
};

//비밀번호 암호화
async function encryptionPw(pw) {
    try{
        // 비밀번호 암호화를 위한 salt 생성
        const salt = await bcrypt.genSalt(10);
        // 생성된 salt를 사용하여 비밀번호를 해시화
        const hash_pw = await bcrypt.hash(pw, salt);
        return hash_pw; // 해시화된 비밀번호 반환
    } catch (error){
        console.error("오류", error);
        // 암호화 오류를 상위 호출자에게 전달
        throw new Error("비밀번호 암호화 오류");
    }
};

//아이디 찾기
async function findUser(user_id = null, name, phone){
    let query
    let values

    if(user_id){
        query = "SELECT user_id FROM member WHERE user_id = ? AND name=? AND phone=?";
        values = [user_id, name, phone];
    }else{
        query = "SELECT user_id FROM member WHERE name=? AND phone=?";
        values = [name, phone];
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

//비밀번호 변경
async function changePw(newPw) {
    const query = "INSERT INTO login_history (user_id, ip_address, history) VALUES (?, ?, CURRENT_TIMESTAMP)";
    const values = [id, ip_address];
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

module.exports = {
    insertUser,
    insertLoginHistory,
    getUser,
    formatDate,
    check,
    encryptionPw,
    findUser,
};