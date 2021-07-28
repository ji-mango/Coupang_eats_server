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
        // 즐겨찾기 상태 확인
        //const statusRows = await mainProvider.statusCheck(userId, restaurantId);
        /*if (statusRows.length > 0) {
            patchBookmarkList(userId, restaurantId);
        }*/
        const postBookmarkInfoParams = [userId, restaurantId];
        const connection = await pool.getConnection(async (conn) => conn);

        const postBookmarkResult = await mainDao.postBookmarkInfo(connection, postBookmarkInfoParams);
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - postBookmark Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

