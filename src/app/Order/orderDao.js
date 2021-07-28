async function selectOrderInfo(connection, userId) {
  const selectOrderQuery = `
  select r.restaurantName,
       ri.imageURL,
       date_format(oi.createdAt, '%Y-%m-%d %p %H:%i') orderDate,
       fc.amount,
       rm.menuName,
       (rm.price * fc.amount + r.deliveryFee) as      totalPrice
    from OrderInformation oi
         join Restaurant r on oi.restaurantId = r.id
         join FoodCart fc on oi.foodCartId = fc.id
         join RestaurantMenu rm on fc.menuId = rm.id
         join RestaurantImage ri on r.id = ri.restaurantId
    where oi.userId = ?
    and ri.number = 1;
  `;
  const selectOrderInfoRow=await connection.query(selectOrderQuery,userId);
  return selectOrderInfoRow[0];
}

module.exports = {
  selectOrderInfo
};

async function selectOrderInfo(connection, userId) {
  const selectOrderQuery = `
  select r.restaurantName,
       ri.imageURL,
       date_format(oi.createdAt, '%Y-%m-%d %p %H:%i') orderDate,
       fc.amount,
       rm.menuName,
       (rm.price * fc.amount + r.deliveryFee) as      totalPrice
    from OrderInformation oi
         join Restaurant r on oi.restaurantId = r.id
         join FoodCart fc on oi.foodCartId = fc.id
         join RestaurantMenu rm on fc.menuId = rm.id
         join RestaurantImage ri on r.id = ri.restaurantId
    where oi.userId = ?
    and ri.number = 1;
  `;
  const selectOrderInfoRow=await connection.query(selectOrderQuery,userId);
  return selectOrderInfoRow[0];
}

module.exports = {
  selectOrderInfo
};

async function selectAddressInfo(connection, userId) {
  const selectAddressQuery = `
    select coalesce(addressTypeInt, roadDescription, roadAddress) as addressDescription, concat(roadAddress," ", detailAddress) as address
    from Address
    where userId = ?
  `;
  const selectAddressInfoRow=await connection.query(selectAddressQuery,userId);
  return selectAddressInfoRow[0];
}

async function insertAddressInfo(connection, insertAddressInfoParams) {
  const insertAddressInfoQuery = `
    INSERT INTO Address(userId, roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  const insertAddressInfoRow = await connection.query(
      insertAddressInfoQuery,
      insertAddressInfoParams
  );
}

async function updateAddressInfo(connection, ) {
  const  updateAddressInfoQuery = `
    
    ;
  `;
  const  updateAddressInfoRow = await connection.query( updateAddressInfoQuery,  );
  return  updateAddressInfoRow[0];
}

async function updateAddressInfo(connection, userId, id, roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText) {
  const updateAddressInfoQuery = `
    UPDATE Address
    SET roadAddress = ?, detailAddress = ?, roadDescription = ?, addressTypeInt = ?, addressTypeText = ?
    WHERE userId = ?
    and id = ?
    ;
  `;
  const updateAddressInfoRow = await connection.query(updateAddressInfoQuery, [roadAddress, detailAddress, roadDescription, addressTypeInt, addressTypeText, userId, id] );
  return updateAddressInfoRow[0];
}

async function deleteAddressInfo(connection, userId, id, status) {
  const deleteAddressInfoQuery = `
    UPDATE Address
    SET status = ?
    WHERE userId = ?
    and id = ?
    ;
  `;
  const deleteAddressInfoRow = await connection.query(deleteAddressInfoQuery, [status, userId, id] );
  return deleteAddressInfoRow[0];
}

async function getCouponInfo(connection, userId) {
  const getCouponInfoQuery = `
    select c.couponName, concat(c.reducedPrice,'원 할인') reducePrice, date_format(c.expirationDate, '%m/%d 까지') as 유효기간
    from UserCoupon u
    join Coupon c on u.couponId = c.id
  `;
  const [getCouponInfoRow] = await connection.query(getCouponInfoQuery, userId);
  return getCouponInfoRow;
}

module.exports = {
  selectOrderInfo,
  selectAddressInfo,
  insertAddressInfo,
  updateAddressInfo,
  deleteAddressInfo,
  getCouponInfo
};