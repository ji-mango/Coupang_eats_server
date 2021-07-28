const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
//exports.getTest = async function (req, res) {
//    return res.send(response(baseResponse.SUCCESS))
//}


/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: phoneNumber, loginId, loginPassword, userName
     */
    const {phoneNumber, loginId, loginPassword, userName} = req.body;

    // 빈 값 체크
    if (!loginId)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if(!loginPassword)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // 길이 체크
    if (loginId.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(loginId))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        phoneNumber,
        loginId,
        loginPassword,
        userName
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const loginId = req.query.loginId;

    if (!loginId) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));  //userListResult가 response의 result값으로 들어감
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(loginId);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : loginId, loginPassword
 */
exports.login = async function (req, res) {

    const {loginId, loginPassword} = req.body;

    // TODO: email, password 형식적 Validation
    //빈 값 확인
    if (!loginId)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    if(!loginPassword)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));

    //email형식 확인
    if (!regexEmail.test(loginId))
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

    const signInResponse = await userService.postSignIn(loginId, loginPassword);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : userName
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const userName = req.body.userName;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!userName) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, userName)
        return res.send(editUserInfo);
    }
};

/**
 * API No. 6
 * API Name : 회원 탈퇴 API
 * [PATCH] /app/deleteUser/:userId
 * path variable : userId
 * body : status
 */
exports.deleteUsers = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const status = req.body.status;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!status) return res.send(errResponse(baseResponse.USER_STATUS_EMPTY));

        const deleteUserInfo = await userService.deleteUser(userId, status)
        return res.send(deleteUserInfo);
    }
}

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

