const prisma = require("../db/prismaClient.js");

const sendFriendReq = async (req, res) => {
  if (req.body.friendCode && req.body.profileIdRequesting) {
    const reqReceiver = await prisma.profile.findFirst({
      where: {
        friendCode: req.body.friendCode,
      },
    });
    if (reqReceiver && (reqReceiver.id != req.body.profileIdRequesting)) {
      const checkForPendingReq = await prisma.friendRequest.findFirst({
        where: {
          
          SenderId: req.body.profileIdRequesting,
          ReceiverId: reqReceiver.id,
          status: "PENDING",
        },
      });

      if (!checkForPendingReq) {
        const friendReqCreated = await prisma.friendRequest.create({
          data: {
            SenderId: req.body.profileIdRequesting,
            ReceiverId: reqReceiver.id,
            status: "PENDING",
          },
        });
        if (friendReqCreated) {
          return res.status(200).json({
            success: true,
            message: "Your friend request has been sent. Waiting for approval.",
          });
        } else {
          return res.status(401).json({
            message: "Something went wrong, please try again later.",
          });
        }
      }
    }
  } else {
    return res.status(401).json({
      message: "Something went wrong, please try again later.",
    });
  }
};

module.exports = {
  sendFriendReq,
};
