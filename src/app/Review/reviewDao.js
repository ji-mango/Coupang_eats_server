// 모든 리뷰 조회
async function reviewList(connection, restaurantId) {
  const reviewListQuery = `
  select u.userName,
       rr.rating,
       rr.reviewText,
       a.menu orderMenu,
       b.likeCount,
       ri.imageURL,
       case
           when timestampdiff(day, rr.createdAt, CURRENT_TIMESTAMP()) < 1
               then '오늘'
           when timestampdiff(day, rr.createdAt, CURRENT_TIMESTAMP()) < 2
               then '1일 전'
           when timestampdiff(day, rr.createdAt, CURRENT_TIMESTAMP()) < 3
               then '2일 전'
           when timestampdiff(day, rr.createdAt, CURRENT_TIMESTAMP()) < 4
               then '3일 전'
           when timestampdiff(day, rr.createdAt, CURRENT_TIMESTAMP()) < 5
               then '4일 전'
           when timestampdiff(day, rr.createdAt, CURRENT_TIMESTAMP()) < 6
               then '5일 전'
           when timestampdiff(day, rr.createdAt, CURRENT_TIMESTAMP()) < 7
               then '6일 전'
           when timestampdiff(day, rr.createdAt, CURRENT_TIMESTAMP()) < 14
               then '지난 주'
           when timestampdiff(month, rr.createdAt, CURRENT_TIMESTAMP()) < 1
               then '이번 달'
           when timestampdiff(month, rr.createdAt, CURRENT_TIMESTAMP()) < 2
               then '지난 달'
           else
               date_format(rr.createdAt, '%Y-%m-%d')
           end
           as createdAt
from RestaurantReview rr
         left join ReviewImage ri on ri.restaurantReviewId = rr.id
         join OrderInformation oi on rr.orderHistoryId = oi.id
         join (
    select u.userName, u.id
    from User u
             left join OrderInformation oi on u.id = oi.userId
    union
    select u.userName, u.id
    from User u
             right join OrderInformation oi on u.id = oi.userId
) u
         join (select rr.id id, concat('주문메뉴 ', rm.menuName) menu
               from RestaurantMenu rm
                        join FoodCart fc on rm.id = fc.menuId
                        join OrderInformation oi on fc.id = oi.foodCartId
                        join RestaurantReview rr on oi.id = rr.orderHistoryId
               group by fc.index) a
         left join (select rl.reviewId review, count(*) likeCount
                    from ReviewLike rl
                    where status = 1
                    group by rl.reviewId) b on b.review = rr.id
where oi.restaurantId = ?
  and a.id = foodCartId
  and u.id = oi.userId
order by rr.createdAt DESC;
                `;
  const [reviewListRows] = await connection.query(reviewListQuery,restaurantId); 
  return reviewListRows;
}

//리뷰쓰기
async function textReviewInfo(connection, reviewText, orderHistoryId, rating, isImage) {
  const textReviewInfoQuery = `
        INSERT INTO RestaurantReview(reviewText, orderHistoryId, rating, isImage)
        VALUES (?, ?, ?, ?);
    `;
  const [textReviewInfoRow] = await connection.query(
    textReviewInfoQuery,
    [reviewText, orderHistoryId, rating, isImage]
  );

  return textReviewInfoRow;
}

//사진 넣기
async function photoReviewInfo(connection, reviewId, imageURL) {
  const photoReviewInfoQuery = `
        INSERT INTO ReviewImage(imageURL, restaurantReviewId)
        VALUES (?, ?);
    `;
  const [photoReviewInfoRow] = await connection.query(
    photoReviewInfoQuery,
    [imageURL, reviewId]
  );

  return photoReviewInfoRow;
}

module.exports = {
  reviewList,
  textReviewInfo,
  photoReviewInfo
};