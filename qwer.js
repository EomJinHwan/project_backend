const {insertUser} = require('./insert');

// 사용자 데이터
const id = 'asdf';
const pw = 'asdf';
const name = 'John Doe';
const phone = '1234567890';
const birth = '1990-01-01'; // birth는 'YYYY-MM-DD' 형식이어야 합니다.

// 사용자 데이터 삽입
insertUser(id, pw, name, phone, birth);
