const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const mainDao = require("./mainDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveRestaurantList = async function (restaurantCategoryId, filter) {
  const connection = await pool.getConnection(async (conn) => conn);
  let condition = '';
  switch(filter) {
    case '0' : condition += 'id'; break;
    case '1' : condition += 'orderCount DESC'; break;
    case '2' : condition += 'distance'; break;
    case '3' : condition += 'distance'; break;
    case '4' : condition += 'createdAt DESC'; break;
  }
  const restaurantResult = await mainDao.selectRestaurantInfo(connection, restaurantCategoryId, condition);
  connection.release();

  return restaurantResult;
}

exports.retrieveRestaurant = async function (id) {
  //유효한 가게인지 체크
  const connection = await pool.getConnection(async (conn) => conn);
  const restaurantCheckResult = await mainDao.selectRestaurant(connection, id);
  if(restaurantCheckResult.length == 0 ) {
      return errResponse(baseResponse.RESTAURANT_RESTAURANTID_NOT_EXIST);
  }

  const retrieveRestaurantResult = await mainDao.retrieveRestaurantInfo(connection, id);
  connection.release();

  return response(baseResponse.SUCCESS, retrieveRestaurantResult);
}

exports.retrieveBookmark = async function (userId, filter) {
  const connection = await pool.getConnection(async (conn) => conn);
  let condition = '';
  switch(filter) {
    case '0' : condition += 'o.countOrder DESC'; break;
    case '1' : condition += 'o.createdAt is null ASC, o.createdAt ASC'; break;
    case '2' : condition += 'b.createdAt'; break;
  }
  const selectBookmarkResult = await mainDao.selectBookmarkInfo(connection, userId, condition);
  connection.release();

  return selectBookmarkResult;
}


exports.getEventList = async function() {
  const connection = await pool.getConnection(async (conn) => conn);
  const getEventListInfoResult = await mainDao.getEventListInfo(connection);
  connection.release();

  return getEventListInfoResult;
}

exports.getNoticeList = async function() {
  const connection = await pool.getConnection(async (conn) => conn);
  const getNoticeListInfoResult = await mainDao.getNoticeListInfo(connection);
  connection.release();

  return getNoticeListInfoResult;
}

exports.bookmarkCheck = async function(userId, restaurantId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const bookmarkCheckResult = await mainDao.selectBookmark(connection,userId, restaurantId);
  connection.release();

  return bookmarkCheckResult;
}

exports.restaurantCheck = async function(restaurantId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const restaurantCheckResult = await mainDao.selectRestaurant(connection, restaurantId);
  connection.release();

  return restaurantCheckResult;
}
