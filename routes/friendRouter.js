const { Router } = require('express');
const friendRouter = Router();
const passport = require('passport');

const { getProfileFriends, sendFriendReq, getPendingFriendReq, updateReceiverFriendReq } = require('../controllers/friendController.js');

friendRouter.get('/get-profile-friend-list/:profileId', passport.authorize('jwt', { session: false }), getProfileFriends);

friendRouter.post('/send-friend-req', passport.authenticate('jwt', { session: false }), sendFriendReq);

friendRouter.get('/get-pending-friend-requests/:receiverProfileId', passport.authenticate('jwt', { session: false }), getPendingFriendReq);

friendRouter.put('/update-receiver-friend-req/:receiverProfileId/:notificationId', passport.authenticate('jwt', { session: false }), updateReceiverFriendReq);

module.exports = friendRouter;