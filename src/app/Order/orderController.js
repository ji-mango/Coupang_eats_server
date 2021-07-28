const jwtMiddleware = require("../../../config/jwtMiddleware");
const orderProvider = require("../../app/Order/orderProvider");
const orderService = require("../../app/Order/orderService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
/**
 * API No. 7
 * API Name : 회원 주문내역 조회
 * [GET] /app/orderHistory/:userId
 * path variable : userId
 */
exports.getOrderHistory = async function (req, res) {
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const orderListResult = await orderProvider.retrieveOrderList(userId);
    return res.send(response(baseResponse.SUCCESS, orderListResult));  //orderListResult가 response의 result값으로 들어감
}

/**
 * API No. 8
 * API Name : 주소목록 조회
 * [GET] /app/address/:userId
 * path variable : userId
 */
exports.getUserAddress = async function (req, res) {
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const addressListResult = await orderProvider.retrieveAddressList(userId);
    return res.send(response(baseResponse.SUCCESS, addressListResult));  //addressListResult가 response의 result값으로 들어감
}

/**
 * API No. 9
 * API Name : 주소 추가
 * [POST] /app/user/:userId/address
 * body : roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText (roadAddress, detailAddress는 필수 작성)
 */
exports.postAddress = async function (req, res) {
        const {roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText} = req.body;
        const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!roadAddress) return res.send(errResponse(baseResponse.USER_ROADADDRESS_EMPTY));
    if (!detailAddress) return res.send(errResponse(baseResponse.USER_DETAILADDRESS_EMPTY));
    const addressResponse = await orderService.userAddress(
        userId,
        roadAddress,
        detailAddress,
        roadDescription,
        addressTypeInt,
        addressTypeText
    );

    return res.send(addressResponse);
}

/**
 * API No. 10
 * API Name : 주소 수정
 * [PATCH] /app/patchAddress/:addressId
 * body : roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText
 */
exports.updateAddresses = async function(req, res) {
    const userId = req.verifiedToken.userId;

    const id = req.params.addressId;
    const {roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText}= req.body;

    if(!id)
        return res.send(errResponse(baseResponse.USER_ADDRESSID_EMPTY));

    const updateAddressInfo = await orderService.updateAddress(userId, id, roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText);
    return res.send(updateAddressInfo);

}
/**
 * API No. 11
 * API Name : 주소 삭제
 * [PATCH] /app/deleteAddress/:addressId
 * body : status
 */
exports.deleteAddresses = async function(req, res) {
    const userId = req.verifiedToken.userId;

    const id = req.params.addressId;
    const status = req.body.status;

    if(!id)
        return res.send(errResponse(baseResponse.USER_ADDRESSID_EMPTY));
    else if(!status || status==0)
        return res.send(errResponse(baseResponse.USER_ADDRESSSTATUS_EMPTY));

        const deleteAddressInfo = await orderService.deleteAddress(userId, id, status);
        return res.send(deleteAddressInfo);

}

/**
 * API No.
 * API Name : 유저 쿠폰 조회 + jwt
 * [GET] /app/user/:userId/coupon
 */
exports.getCoupon = async function (req, res) {
    const userId = req.verifiedToken.userId

    const getCouponListResult = await orderProvider.getCouponList(userId);
    return res.send(response(baseResponse.SUCCESS, getCouponListResult))  //getEventListResult가 response의 result값으로 들어감
}
