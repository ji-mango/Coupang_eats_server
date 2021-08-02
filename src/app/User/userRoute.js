 module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('../../../node_modules/passport');
    const KaKaoStrategy = require('../../../node_modules/passport-kakao').Strategy;

    // 0. 테스트 API
    //app.get('/app/test', user.getTest)

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 2. 유저 조회 API (+ 검색)
    app.get('/app/users',user.getUsers);

    // 3. 특정 유저 조회 API
    app.get('/app/users/:userId', user.getUserById);

    // TODO: After 로그인 인증 방법 (JWT)
    // 4. 로그인 API (JWT 생성)
    app.post('/app/login', user.login);

    // 5. 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

     // 6. 탈퇴하기 API
     app.patch('/app/userout/:userId', jwtMiddleware, user.deleteUsers)

     //카카오 소셜 로그인 API
     app.post('/users/kakaoLogin',user.kakaoLogin)
     app.get('/kakao', passport.authenticate('kakao'));
     app.get('/auth/kakao/callback', passport.authenticate('kakao', {
      successRedirect: '/',
      failureRedirect: '/',
     }), (req, res) => {
      res.redirect('/');
     });

     passport.use('kakao', new KaKaoStrategy( {
      clientID : '593cba0bc3ea7f52024615b72630d3ee',
      callbackURL : '/auth/kakao/callback',
   }, async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);
   }))
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);