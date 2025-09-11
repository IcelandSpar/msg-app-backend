const passport = require('passport');
const { Router } = require('express');
const directMessageRouter = Router();
const { postMessage } = require('../controllers/directMessageController.js');


directMessageRouter.post('/post-message', passport.authenticate('jwt', {session: false}), postMessage);

module.exports = directMessageRouter;

