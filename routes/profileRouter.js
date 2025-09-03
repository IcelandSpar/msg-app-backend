const { Router } = require('express');
const { getUserProfile, getProfile, updateProfileInfo } = require('../controllers/profileController.js');
const passport = require('passport');

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/profile-images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/svg+xml"
  ) {
    return cb(null, true);
  } else {

    return cb(null, false);
  }
};

const upload = multer({
  storage: storage,

  // dest: './public/profile-images',
  fileFilter: fileFilter,
});

const profileRouter = Router();

profileRouter.get('/get-user-profile', passport.authenticate('jwt', { session: false }), getUserProfile);

profileRouter.put('/update-profile-info', upload.single('profilePicture'),passport.authenticate('jwt', { session: false }), updateProfileInfo);

profileRouter.get('/get-profile/:profileId', passport.authenticate('jwt', { session: false }), getProfile);

module.exports = profileRouter;