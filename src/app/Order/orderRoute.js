 module.exports = function(app){
    const order = require('./orderController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

     //7. 주문내역 조회 API (유저아이디로 조회)
     app.get('/app/user/:userId/orderHistory',order.getOrderHistory)

     //8. 주소 목록 조회 API (유저아이디로 조회) + TODO : 쿼리스트링으로 대표주소 출력
     app.get('/app/user/:userId/address',order.getUserAddress)

     //9. 주소 추가 API
     app.post('/app/user/:userId/postAddress',order.postAddress)

     //10. 주소 수정 API
     app.patch('/app/updateAddress/:addressId',jwtMiddleware, order.updateAddresses)

     //11. 주소 삭제 API
     app.patch('/app/deleteAddress/:addressId',jwtMiddleware, order.deleteAddresses)

     //대표주소 변경 API

     //리뷰조회 API
     //app.get('/app/review',order.getReview)

     //리뷰 도움돼요/안돼요 API

     //할인쿠폰 조회 API
     app.get('/app/coupon', jwtMiddleware, order.getCoupon)

};

