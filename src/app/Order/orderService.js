const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const orderProvider = require("./orderProvider");
const orderDao = require("./orderDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.userAddress = async function(userId, roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText) {
    try {
        // TODO : 존재하는 userId인지 체크

        const insertAddressInfoParams = [userId, roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText];

        const connection = await pool.getConnection(async (conn) => conn);
        const userAddressResult = await orderDao.insertAddressInfo(connection, insertAddressInfoParams);
        //console.log(`추가된 주소 : ${userAddressResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - address Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.updateAddress = async function(userId, id, roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const updateAddressResult = await orderDao.updateAddressInfo(connection, userId, id, roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText);
        connection.release();

        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - updateAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteAddress = async function(userId, id, status) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteAddressResult = await orderDao.deleteAddressInfo(connection, userId, id, status);
        connection.release();

        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - deleteAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}