const {insertLoginHistory} = require('./insert');

// 사용자 데이터
const user_id = 'testuser';
const ip_adress = '111.111.111.111'; // 정확한 값

// 사용자 데이터 삽입
insertLoginHistory(user_id, ip_adress);