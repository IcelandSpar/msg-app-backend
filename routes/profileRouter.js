const { Router } = require('express');
const { getUserProfile, getProfile, updateProfileInfo } = require('../controllers/profileController.js');
const passport = require('passport');

const profileRouter = Router();

profileRouter.get('/get-user-profile', passport.authenticate('jwt', { session: false }), getUserProfile);

profileRouter.put('/update-profile-info', passport.authenticate('jwt', { session: false }), updateProfileInfo);

profileRouter.get('/get-profile/:profileId', passport.authenticate('jwt', { session: false }), getProfile);

module.exports = profileRouter;