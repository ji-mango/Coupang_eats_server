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

exports.setReviewLike = async function(userId, reviewId, likeStatus) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        //눌렀던 기록 있는지 체크
        const likeHistoryResult = await reviewProvider.likeCheck(userId, reviewId);
        let status = 2;
        
        //있으면 status체크해서 바꿔주기
        if(likeHistoryResult.length>0) {
            console.log(likeHistoryResult[0].status)
            if(likeHistoryResult[0].status==likeStatus) {
                status = 0;
            }
            else {
                status = likeStatus;
            }
            const setlikeStatusResult = await reviewDao.setLikeStatus(connection, userId, reviewId, status);
        }
        //없으면 즐겨찾기 생성
        else {
            const postlikeResult = await reviewDao.postLikeInfo(connection, userId, reviewId, likeStatus);
        }
    }

    catch (err) {
        logger.error(`App - setReviewLike Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }  
}

exports.setReviewUnlike = async function(userId, reviewId) {
    try {

    }

    catch (err) {
        logger.error(`App - setReviewUnlike Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }  
}