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

/*exports.setReviewLike = async function(userId) {
    try {
        //눌렀던 기록 있는지 체크
        const likeHistoryResult = await mainProvider.bookmarkCheck(userId, restaurantId);
        let status=1;
        
        //있으면 status가 1인지 0인지 체크해서 바꿔주기
        if(bookmarkHistoryResult.length>0) {
            if(bookmarkHistoryResult[0].status == 0) {
                status = 1
            }
            else if(bookmarkHistoryResult[0].status==1) {
                status = 0
            }
            const setBookmarkStatusResult = await mainDao.setBookmarkStatus(connection, userId, restaurantId, status);
        }
        //없으면 즐겨찾기 생성
        else {
            const postBookmarkResult = await mainDao.postBookmarkInfo(connection, userId, restaurantId);
        }
    }

    catch (err) {
        logger.error(`App - setReviewLike Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }  
}

exports.setReviewUnlike = async function(userId) {
    try {

    }

    catch (err) {
        logger.error(`App - setReviewUnlike Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }  
}*/