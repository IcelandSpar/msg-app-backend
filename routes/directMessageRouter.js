const passport = require("passport");
const { Router } = require("express");
const directMessageRouter = Router();
const {
  getDirectMessages,
  postMessage,
} = require("../controllers/directMessageController.js");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/direct-msg-images");
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
directMessageRouter.get(
  "/get-direct-messages/:directMessageGroupId",
  passport.authenticate("jwt", { session: false }),
  getDirectMessages
);

directMessageRouter.post(
  "/post-message",
  passport.authenticate("jwt", { session: false }),
  upload.single("msgImg"),
  postMessage
);

module.exports = directMessageRouter;
