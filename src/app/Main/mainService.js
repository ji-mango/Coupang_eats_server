const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const mainProvider = require("./mainProvider");
const mainDao = require("./mainDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.postBookmarkList = async function (userId, restaurantId) {
    try {
        //유효한 restaurantId 인지 체크
        const restaurantResult = await mainProvider.restaurantCheck(restaurantId);
        if(restaurantResult.length == 0 ) {
            return errResponse(baseResponse.RESTAURANT_RESTAURANTID_NOT_EXIST);
        }

        const connection = await pool.getConnection(async (conn) => conn);
         
        //눌렀던 기록 있는지 체크
        const bookmarkHistoryResult = await mainProvider.bookmarkCheck(userId, restaurantId);
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

        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - postBookmark Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

