const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const reviewProvider = require("./reviewProvider");
const reviewDao = require("./reviewDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.postReview = async function(restaurantId, userId, reviewText, orderHistoryId, imageURL, rating, isImage) {
        try {
            //TODO : 같은 orderHistoryId가 있는지 체크
            //TODO : 해당 유저가 주문한게 맞는지 체크
            const connection = await pool.getConnection(async (conn) => conn);
            
            const textReviewInfoResult = await reviewDao.textReviewInfo(connection, reviewText, orderHistoryId, rating, isImage);
            const reviewId = textReviewInfoResult.insertId;
            if(isImage = 1) {
                const photoReviewInfoResult = await reviewDao.photoReviewInfo(connection, reviewId, imageURL);
            }
            connection.release();
            return response(baseResponse.SUCCESS);
    
        } catch (err) {
            logger.error(`App - postReview Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }    
}