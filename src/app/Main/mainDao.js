//testtest
async function selectRestaurantInfo(connection, restaurantCategoryId, condition) {
  const selectRestaurantQuery = `
    select ri.imageURL, r.restaurantName,r.distance, r.isCheetah, r.deliveryTime,ra.avgReview, ra.countReview, r.deliveryFee, oc.orderCount orderCount
    from Restaurant r
           left join RestaurantImage ri on r.id = ri.restaurantId
           left join (select avg(rr.rating) as avgReview, count(rr.rating) as countReview, r.id rId
                      from RestaurantReview rr
                             join OrderInformation oi on rr.orderHistoryId = oi.id
                             join Restaurant r on oi.restaurantId = r.id
                      group by r.id) ra on ra.rId = r.id
           left join (
      select oi.restaurantId, count(*) as orderCount
      from OrderInformation oi
      group by oi.restaurantId
    ) oc on oc.restaurantId = r.id
    where r.restaurantCategoryId= ?
      and r.isCheetah=1
      and r.deliveryFee<=2000
      and ri.number =1
    order by `+condition+`;
  `;
  const [selectRestaurantInfoRow]=await connection.query(selectRestaurantQuery,[restaurantCategoryId, condition]);
  return selectRestaurantInfoRow;
}

async function retrieveRestaurantInfo(connection, id) {
  const retrieveRestaurantQuery = `
    select ri.imageURL,
           r.restaurantName,
           a.avgRating,
           a.reviewCount,
           concat(r.deliveryTime, '~', r.deliveryTime + 10, '분') deliveryTime,
           case r.isCheetah
             when 0 then null
             when 1 then '치타배달' end                      as    isCheetah,
           case r.deliveryFee
             when 0 then '무료배달'
             else concat('배달비 ', r.deliveryFee, '원') end as    deliveryFee,
           concat('최소주문 ', r.minimumPrice, '원')                  minimunPrice
    from Restaurant r
           join RestaurantImage ri on r.id = ri.restaurantId
           join (
      select avg(rr.rating) avgRating, count(*) reviewCount, r.id
      from RestaurantReview rr
             join OrderInformation oi on rr.orderHistoryId = oi.id
             join Restaurant r on oi.restaurantId = r.id
      group by r.id
    ) a
    where a.id = r.id
      and ri.number = 1
      and r.id = ?;
  `;
  const [retrieveRestaurantInfoRow] = await connection.query(retrieveRestaurantQuery,id);
  return retrieveRestaurantInfoRow;
}

async function selectBookmarkInfo(connection, userId, condition) {
  const selectBookmarkQuery = `
    select r.restaurantName,
           r.imageURL,
           r.deliveryTime,
           r.deliveryFee,
           ra.avgRating,
           ra.countReview,
           o.countOrder '주문수',
        o.createdAt '주문날짜',
        b.createdAt '즐겨찾기 추가 날짜'

    from (select r.id, r.restaurantName, r.deliveryTime, r.deliveryFee, ri.imageURL
          from Restaurant r
                 left join RestaurantImage ri on r.id = ri.restaurantId
          group by r.id) r
           left join Bookmark b on r.id = b.restaurantId
           left join (select oi.restaurantId, count(rr.rating) as countReview, round(avg(rr.rating), 1) as avgRating
                      from RestaurantReview rr
                             join OrderInformation oi on rr.orderHistoryId = oi.id
                      group by oi.restaurantId) ra on b.restaurantId = ra.restaurantId
           left join (select restaurantId, count(*) as countOrder, createdAt
                      from OrderInformation
                      where userId = 1
                      group by restaurantId
    ) o on o.restaurantId = b.restaurantId
    where b.userId = ?
      and b.isDeleted = 0
      and b.status = 0
    order by `+condition+`;
  `;
  const [selectBookmarkInfoRow] = await connection.query(selectBookmarkQuery,[userId,condition]);
  return selectBookmarkInfoRow;
}

async function selectRestaurant(connection, restaurantId) {
  const selectRestaurantQuery = `
  SELECT restaurantName, id
  FROM Restaurant
  WHERE id = ?
  `
  const [restaurantRows] = await connection.query(selectRestaurantQuery, restaurantId);
  return restaurantRows;
}

async function selectBookmark(connection,userId, restaurantId) {
  const selectBookmarkQuery = `
  SELECT status
  FROM Bookmark
  WHERE userId = ?
  and restaurantId = ?; 
  `;
  const [bookmarkRow]=await connection.query(selectBookmarkQuery,[userId, restaurantId]);
  return bookmarkRow;
}

async function setBookmarkStatus(connection,userId, restaurantId, status) {
  const setBookmarkStatusQuery = `
    UPDATE Bookmark
    SET status = ?
    where userId= ?
    and restaurantId = ?;
  `;
  const [BookmarkStatusRow]=await connection.query(setBookmarkStatusQuery,[status, userId, restaurantId]);
  return BookmarkStatusRow;
}

async function postBookmarkInfo(connection, userId, restaurantId) {
  const postBookmarkInfoQuery = `
        INSERT INTO Bookmark(userId, restaurantId)
        VALUES (?, ?);
    `;
  const postBookmarkInfoRow = await connection.query(
      postBookmarkInfoQuery,
      [userId, restaurantId]
  );

  return postBookmarkInfoQuery;
}

async function getEventListInfo(connection) {
  const getEventListInfoQuery = `
   select e.eventImageURL, date_format(e.expirationDate, '~%m.%d 까지') expirationDate
    from Event e;
  `;
  const [getEventListInfoRow]=await connection.query(getEventListInfoQuery,[]);
  return getEventListInfoRow;
}

async function getNoticeListInfo(connection) {
  const getNoticeListInfoQuery = `
    select date_format(createdAt, '20%y.%m.%d') as '날짜', noticeName as '제목'
    from Notice;
  `;
  const [getNoticeListInfoRow]=await connection.query(getNoticeListInfoQuery,[]);
  return getNoticeListInfoRow;
}



module.exports = {
  selectRestaurantInfo,
  retrieveRestaurantInfo,
  selectBookmarkInfo,
  postBookmarkInfo,
  getEventListInfo,
  getNoticeListInfo,
  selectUser,
  selectRestaurant,
  selectBookmark,
  setBookmarkStatus,
};