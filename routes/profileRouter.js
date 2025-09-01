const { Router } = require('express');
const { getUserProfile, getProfile } = require('../controllers/profileController.js');
const passport = require('passport');

const profileRouter = Router();

profileRouter.get('/get-user-profile', passport.authenticate('jwt', { session: false }), getUserProfile);

profileRouter.get('/get-profile/:profileId', passport.authenticate('jwt', { session: false }), getProfile);

module.exports = profileRouter;