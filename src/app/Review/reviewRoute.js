 module.exports = function(app){
    const review = require('./reviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //19. 리뷰 조회 API
    app.get('/app/review', review.getReviews);

    //20. 리뷰 쓰기 API
    app.post('/app/review',jwtMiddleware, review.postReviews);

    //22. 리뷰 도움돼요/안돼요 API
    app.post('/app/reviewLike', jwtMiddleware, review.postReviewLike);
};