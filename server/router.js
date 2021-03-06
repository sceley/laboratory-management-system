const Router = require('express').Router;
const bodyparser = require('body-parser');
const redis = require('./model/redis');

//controllers
const login = require('./controllers/api/user').login;
const logup = require('./controllers/api/user').logup;
const mobileLogup = require('./controllers/api/user').mobileLogup;
const editInfo = require('./controllers/api/user').editInfo;
const filling = require('./controllers/api/user').filling;
const showInfo = require('./controllers/api/user').showInfo;
const showUsers = require('./controllers/api/user').showUsers;
const monitorUser = require('./controllers/api/user').monitorUser;
const addExp = require('./controllers/api/experiment').addExp;
const monitorExp = require('./controllers/api/experiment').monitorExp;
const showRestExps = require('./controllers/api/experiment').showRestExps;
const showExpsStatus = require('./controllers/api/experiment').showExpsStatus;
const showExps = require('./controllers/api/experiment').showExps;
const editExp = require('./controllers/api/experiment').editExp;
const addReserve = require('./controllers/api/reserve').addReserve;
const getUserReserves = require('./controllers/api/reserve').getUserReserves;
const getReserves = require('./controllers/api/reserve').getReserves;
const switchReserve = require('./controllers/api/reserve').switchReserve;
const deleteReserve = require('./controllers/api/reserve').deleteReserve;
const adminLogin = require('./controllers/api/admin').login;
const notify = require('./controllers/api/notification').notify;
const notifications = require('./controllers/api/notification').notifications;
const deleteNotification = require('./controllers/api/notification').deleteNotification;
const notification = require('./controllers/api/notification').notification;
const feedback = require('./controllers/api/feedback').feedback;
const feedbackReply = require('./controllers/api/feedback').reply;
const getFeedback = require('./controllers/api/feedback').getFeedback;
const getFeedbackReply = require('./controllers/api/feedback').getFeedbackReply;
const expdatastatics = require('./controllers/api/expdatastatistics').expdatastatics;
const downloadReservations = require('./controllers/api/expdatastatistics').downloadReservations;
const scanningOpen = require('./controllers/api/scanning').scanningOpen;

//middleware
const user_session = require('./middleware/oauth').user_session;
const admin_session = require('./middleware/oauth').admin_session;
const oauthUser = require('./middleware/oauth').oauthUser;
const authFinger = require('./middleware/oauth').authFinger;

//powerswitch
let router = Router();

//get
router.get('/api/exps/status', showExpsStatus);
router.get('/api/notifications', notifications);
router.get('/api/user/reserves', user_session, getUserReserves);
router.get('/api/admin/reserves', admin_session, getReserves);
router.get('/api/user/info', user_session, showInfo);
router.get('/api/admin/users', admin_session, showUsers);
router.get('/api/admin/monitorexp/:id', admin_session, monitorExp);
router.get('/api/admin/exps', admin_session, showExps);
router.get('/api/feedback', getFeedback);
router.get('/api/feedback/reply', user_session, getFeedbackReply);
router.get('/api/admin/expdatastatics', expdatastatics);
router.get('/api/admin/reservation/download', downloadReservations);
router.get('/api/notification/details/:id', notification);

router.get('/api/scanning/open', user_session, scanningOpen);

//delete
router.delete('/api/user/reserve/:id', deleteReserve);
router.delete('/api/admin/notification/:id', admin_session, deleteNotification);
//middleware
router.use(bodyparser.json());
//post
router.post('/api/restexps', showRestExps);
router.post('/api/user/login', login);
router.post('/api/user/logup', logup);
router.post('/api/mobile/user/logup', mobileLogup);
router.post('/api/user/info/edit', user_session, editInfo);
router.post('/api/user/fillinginfo', user_session, filling);
router.post('/api/user/addreserve', user_session, authFinger, oauthUser, addReserve);
router.post('/api/user/feedback', user_session, feedback);
router.post('/api/admin/login', adminLogin);
router.post('/api/admin/switchreserve', admin_session, switchReserve);
router.post('/api/admin/monitoruser', admin_session, monitorUser);
router.post('/api/admin/addexp', admin_session, addExp);
router.post('/api/admin/notify', admin_session, notify);
router.post('/api/admin/exp/edit', admin_session, editExp);
router.post('/api/admin/feedback/:id/reply', admin_session, feedbackReply);


module.exports = router;