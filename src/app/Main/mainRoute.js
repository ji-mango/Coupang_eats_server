 module.exports = function(app){
    const main = require('./mainController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

     //13. 가게 조회 API + 필터링
     app.get('/app/restaurants/:categoryId',main.getRestaurantsByCategory)

     //14. 선택 가게 조회 API
     app.get('/app/restaurant/:restaurantId',main.getRestaurantById)

     //15. 유저의 즐겨찾기 가게 조회 API + 나열 기준 선택
     app.get('/app/bookmark', jwtMiddleware, main.getBookmark)

     //16. 즐겨찾기 누르기 API
     app.post('/app/bookmark',jwtMiddleware, main.postBookmark)

     //17. 이벤트 목록 조회 TODO : 쿼리스트링으로 특정 이벤트 조회
     app.get('/app/events',main.getEvent)

     //18. 공지사항 목록 조회 TODO : 쿼리스트링으로 특정 공지사항 조회
     app.get('/app/notice',main.getNotice)
 };

