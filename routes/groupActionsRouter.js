const { Router } = require("express");
const {
  getMemberGroups,
  getSearchedGroups,
  getGroupInfo,
  createGroup,
  joinGroup,
  getGroupChatMessages,
} = require("../controllers/groupActionsController");
const groupActionsRouter = Router();

const multer = require("multer");
const passport = require("passport");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/group-images");
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

groupActionsRouter.get(
  "/get-group-chat-msgs/:groupId",
  passport.authenticate("jwt", { session: false }),
  getGroupChatMessages
);

groupActionsRouter.get(
  "/get-member-groups",
  passport.authenticate("jwt", { session: false }),
  getMemberGroups
);

groupActionsRouter.get(
  "/get-searched-groups/:groupNameSearching/:profileId",
  passport.authenticate("jwt", { session: false }),
  getSearchedGroups
);

groupActionsRouter.get(
  '/get-group-info/:groupId',
  passport.authenticate('jwt', {session: false}),
  getGroupInfo
);

groupActionsRouter.post(
  '/join-group/:groupId/:profileId',
passport.authenticate('jwt', { session: false }),
joinGroup)

groupActionsRouter.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  upload.single("groupImg"),
  createGroup
);

module.exports = groupActionsRouter;
