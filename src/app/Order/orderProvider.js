const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const orderDao = require("./orderDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveOrderList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userOrderResult = await orderDao.selectOrderInfo(connection, userId);
  connection.release();

  return userOrderResult;
}

exports.retrieveAddressList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAddressResult = await orderDao.selectAddressInfo(connection, userId);
  connection.release();

  return userAddressResult;
}


exports.getCouponList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getCouponInfoResult = await orderDao.getCouponInfo(connection, userId);
  connection.release();

  return getCouponInfoResult;
}