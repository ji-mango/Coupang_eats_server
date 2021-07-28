 module.exports = function(app){
    const main = require('./mainController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

     //13. 가게 조회 API + 필터링
     app.get('/app/category/:categoryId/restaurant',main.getRestaurantsByCategory)

     //14. 가게 메인화면 조회 API
     app.get('/app/restaurant/:restaurantId',main.getRestaurantById)

     //15. 유저의 즐겨찾기 가게 조회 API + 나열 기준 선택
     app.get('/app/user/:userId/bookmark', main.getBookmark)

     //16. 즐겨찾기 누르기 API(수정해야됨)
     app.post('/app/user/:userId/setBookmark', main.postBookmark)

     //17. 이벤트 목록 조회 TODO : 쿼리스트링으로 특정 이벤트 조회
     app.get('/app/event',main.getEvent)

     //18. 공지사항 목록 조회 TODO : 쿼리스트링으로 특정 공지사항 조회
     app.get('/app/notice',main.getNotice)

     //18.
 };

