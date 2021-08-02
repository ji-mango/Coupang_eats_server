const jwtMiddleware = require("../../../config/jwtMiddleware");
const reviewProvider = require("../../app/Review/reviewProvider");
const reviewService = require("../../app/Review/reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 19
 * API Name : 리뷰 조회
 * [GET] /app/review
 */
exports.getReviews = async function (req, res) {
    const restaurantId = req.query.restaurantId

    const retrieveReviewResult = await reviewProvider.retrieveReview(restaurantId);
    return res.send(response(baseResponse.SUCCESS, retrieveReviewResult)); 
};

/**
 * API No. 20
 * API Name : 리뷰 쓰기
 * [POST] /app/review
 */
exports.postReviews = async function (req, res) {
    const restaurantId = req.query.restaurantId;
    const userId = req.verifiedToken.userId;
    let isImage=1;
    const {reviewText, orderHistoryId, imageURL, rating} = req.body;

    if(!orderHistoryId) {
        return res.send(errResponse(baseResponse.USER_ORDERID_EMPTY));
    }
    if(!imageURL) {
        isImage = 0;
    }
    if(!rating) {
        return res.send(errResponse(baseResponse.REVIEW_RATING_EMPTY));
    }

    const postReviewResult = await reviewService.postReview(restaurantId, userId, reviewText, orderHistoryId, imageURL, rating, isImage);
    return res.send(response(baseResponse.SUCCESS)); 
};

/**
 * API No. 21
 * API Name : 리뷰 도움돼요/안돼요 API
 * [POST] /app/reviewLike
 */
 exports.postReviewLike = async function (req, res) {
    const userId = req.verifiedToken.userId;
    const {reviewId, status} = req.body;  //status가 1이면 도움돼요 버튼, 2이면 도움 안돼요 버튼

    if(!status) {
        return res.send(errResponse(baseResponse.REVIEW_STATUS_EMPTY));
    }
    if(!(status==1 || status==2)) {
        return res.send(errResponse(baseResponse.REVIEW_STATUS_INACCURITY));
    }
    if(!reviewId) {
        return res.send(errResponse(baseResponse.REVIEW_ID_EMPTY));
    }

    const reviewLikeResult = await reviewService.setReviewLike(userId, reviewId, status);

    return res.send(response(baseResponse.SUCCESS)); 
};