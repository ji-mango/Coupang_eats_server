const jwtMiddleware = require("../../../config/jwtMiddleware");
const mainProvider = require("../../app/Main/mainProvider");
const mainService = require("../../app/Main/mainService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");


/**
 * API No. 13
 * API Name : 카테고리별 가게 조회 + 필터링
 * [GET] /app/restaurants/:categoryId
 * query string
 */
exports.getRestaurantsByCategory = async function (req, res) {
    const categoryId = req.params.categoryId;
    var filter = req.query.filter;

    if (!categoryId) return res.send(errResponse(baseResponse.RESTAURANT_CATEGORY_EMPTY));
    const restaurantListResult = await mainProvider.retrieveRestaurantList(categoryId, filter);
    return res.send(response(baseResponse.SUCCESS, restaurantListResult));  //restaurantListResult가 response의 result값으로 들어감

}

/**
 * API No. 14
 * API Name : 선택 가게 조회
 * [GET] /app/restaurant/:restaurantId
 * query string
 */
exports.getRestaurantById = async function (req, res) {
    const id = req.params.restaurantId;

    if (!id) return res.send(errResponse(baseResponse.RESTAURANT_ID_EMPTY));
    const restaurantResult = await mainProvider.retrieveRestaurant(id);
    return res.send(response(baseResponse.SUCCESS, restaurantResult));  //restaurantResult가 response의 result값으로 들어감

}

/**
 * API No. 15
 * API Name : 유저 즐겨찾기 조회 + 나열 기준선택
 * [GET] /app/bookmark
 * jwt
 */

exports.getBookmark = async function (req, res) {
    const userId = req.verifiedToken.userId;
    var filter = req.query.filter;

    const bookmarkResult = await mainProvider.retrieveBookmark(userId, filter);
    return res.send(response(baseResponse.SUCCESS, bookmarkResult));  //bookmarkResult가 response의 result값으로 들어감

}

/**
 * API No. 16
 * API Name : 즐겨찾기 누르기 API
 * [POST] /app/makeBookmark/:userId
 * body : restaurantId
 */
exports.postBookmark = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const restaurantId = req.body.restaurantId;

    //restaurantId 빈 값 체크
    if(!restaurantId)
        return res.send(errResponse(baseResponse.RESTAURANT_ID_EMPTY));

    const postBookmarkListResult = await mainService.postBookmarkList(userId, restaurantId);
    return res.send(postBookmarkListResult);  //bookmarkResult가 response의 result값으로 들어감
}

/**
 * API No. 17
 * API Name : 이벤트 목록 조회 API
 */

exports.getEvent = async function (req, res) {

    const getEventListResult = await mainProvider.getEventList();
    return res.send(response(baseResponse.SUCCESS, getEventListResult))  //getEventListResult가 response의 result값으로 들어감
}

/**
 * API No. 18
 * API Name : 공지 목록 조회 API
 */

exports.getNotice = async function (req, res) {

    const getNoticeListResult = await mainProvider.getNoticeList();
    return res.send(response(baseResponse.SUCCESS, getNoticeListResult))  //getEventListResult가 response의 result값으로 들어감
}