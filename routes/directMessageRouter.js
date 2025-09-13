const passport = require('passport');
const { Router } = require('express');
const directMessageRouter = Router();
const { getDirectMessages, postMessage } = require('../controllers/directMessageController.js');

directMessageRouter.get('/get-direct-messages/:directMessageGroupId', passport.authenticate('jwt', {session: false}), getDirectMessages);

directMessageRouter.post('/post-message', passport.authenticate('jwt', {session: false}), postMessage);

module.exports = directMessageRouter;

