const { Router } = require('express');
const chatRouter = Router();
const passport = require('passport');
const { postChatMsg } = require('../controllers/chatController.js');



const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/msg-images");
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
    file.mimetype == "image/svg+xml" ||
    file.mimetype == "image/gif"
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


chatRouter.post(
  "/post-chat-msg",
  passport.authenticate("jwt", { session: false }),
  upload.single("msgImg"),
  postChatMsg,
)

module.exports = chatRouter;