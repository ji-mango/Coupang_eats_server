const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const reviewDao = require("./reviewDao");

// Provider: Read 비즈니스 로직 처리


exports.retrieveReview = async function (restaurantId) {
 
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewListResult = await reviewDao.reviewList(connection, restaurantId);
    connection.release();

    return reviewListResult;
};

exports.likeCheck = async function(userId, reviewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const likeResult = await reviewDao.likeInfo(connection, userId, reviewId);
    connection.release();

    return likeResult;
}
