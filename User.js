class User {
    constructor(id, pw, name, phone, birth) {
        this.user_id = id;
        this.user_pw = pw;
        this.name = name;
        this.phone = phone;
        this.birth = birth;
    }

    getInfo() { //캡슐화 - 보안성
        return {
            user_id: this.user_id,
            user_pw: this.user_pw,
            name: this.name,
            phone: this.phone,
            birth: this.birth
        };
    }
}

module.exports = User;