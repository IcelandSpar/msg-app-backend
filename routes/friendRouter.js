const { Router } = require('express');
const friendRouter = Router();
const passport = require('passport');

const { sendFriendReq, getPendingFriendReq }= require('../controllers/friendController.js');

friendRouter.post('/send-friend-req', passport.authenticate('jwt', { session: false }), sendFriendReq);

friendRouter.get('/get-pending-friend-requests/:receiverProfileId', passport.authenticate('jwt', { session: false }), getPendingFriendReq);

module.exports = friendRouter;