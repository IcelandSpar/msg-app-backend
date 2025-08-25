const { Router } = require('express');
const friendRouter = Router();

const { sendFriendReq }= require('../controllers/friendController.js');

friendRouter.post('/send-friend-req', sendFriendReq);

module.exports = friendRouter;