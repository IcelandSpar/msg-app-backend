const { Router } = require("express");
const friendRouter = Router();
const passport = require("passport");

const {
  checkIfFriend,
  getProfileFriends,
  sendFriendReq,
  getPendingFriendReq,
  updateReceiverFriendReq,
  getFriendDirectMessageGroup,
  deleteFriendReq,
  deleteFriendAndRequests,
} = require("../controllers/friendController.js");

friendRouter.get(
  "/check-if-friend/:userProfileId/:userFriendProfileId",
  passport.authenticate("jwt", { session: false }),
  checkIfFriend
);

friendRouter.get(
  "/get-profile-friend-list/:profileId",
  passport.authorize("jwt", { session: false }),
  getProfileFriends
);

friendRouter.post(
  "/send-friend-req",
  passport.authenticate("jwt", { session: false }),
  sendFriendReq
);

friendRouter.get(
  "/get-pending-friend-requests/:receiverProfileId",
  passport.authenticate("jwt", { session: false }),
  getPendingFriendReq
);

friendRouter.put(
  "/update-receiver-friend-req/:receiverProfileId/:notificationId",
  passport.authenticate("jwt", { session: false }),
  updateReceiverFriendReq
);

friendRouter.get(
  "/get-direct-message-group/:senderId/:receiverId",
  passport.authenticate("jwt", { session: false }),
  getFriendDirectMessageGroup
);

friendRouter.delete(
  "/delete-friend-req/:requestId",
  passport.authenticate("jwt", { session: false }),
  deleteFriendReq
);

friendRouter.delete(
  "/delete-friend-and-friend-requests/:userProfileId/:userFriendProfileId",
  passport.authenticate("jwt", { session: false }),
  deleteFriendAndRequests
);

module.exports = friendRouter;
