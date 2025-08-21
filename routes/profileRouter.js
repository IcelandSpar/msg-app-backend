const { Router } = require('express');
const { getUserProfile } = require('../controllers/profileController.js');
const passport = require('passport');

const profileRouter = Router();

profileRouter.get('/get-user-profile', passport.authenticate('jwt', { session: false }), getUserProfile);

module.exports = profileRouter;