const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (phoneNumber, loginId, loginPassword, userName) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(loginId);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(loginPassword)
            .digest("hex");

        const insertUserInfoParams = [phoneNumber, loginId, hashedPassword, userName];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (loginId, loginPassword) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(loginId);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);   //select된(일치하는) 데이터가 없으면 에러처리

        const selectEmail = emailRows[0].loginId

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(loginPassword)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        console.log(passwordRows[0].loginPassword);
        if (passwordRows[0].loginPassword !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(loginId);

        if (userInfoRows[0].status === 2) {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === 0) {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].id) // DB의 userId

        //토큰 생성 Service ??공부해야할듯
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (id, userName) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, userName)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}