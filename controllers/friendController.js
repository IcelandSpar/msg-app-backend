const prisma = require("../db/prismaClient.js");
const { returnUserObjFromToken } = require('../utils/userQuery.js');

const getProfileFriends = async (req, res) => {
  const profileFriendList = await prisma.friend.findMany({
    where: {
        OR: [
          {
            friendOneId: req.params.profileId,
          },
          {
            friendTwoId: req.params.profileId
          }
        ]    },
        include: {
          friendOne: true,
          friendTwo: true,
        }
  });

  return res.json(profileFriendList)
}

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

const getPendingFriendReq = async (req, res) => {

  try {
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        ReceiverId: req.params.receiverProfileId,
      },
      include: {
        Sender: true,
      }
    });

    return res.status(200).json(friendRequests);
  } catch (err) {
    if(err) {
      return res.status(401).json({
        message: 'Something went wrong...'
      })
    }
  }
  
};

const updateReceiverFriendReq = async (req, res) => {
  try {

    const parsedUserFriendReqSelection = req.query.isFriendReqAccepted == 'true' ? 'ACCEPTED' : 'DECLINED';

  // update friend request to ACCEPTED or DECLINED

    const updatedFriendReq = await prisma.friendRequest.update({
      where: {
        id: req.params.notificationId,
      },
      data: {
        status: parsedUserFriendReqSelection,
      }
    });

  // create friend link
  

    const createdFriendLink = await prisma.friend.create({
      data: {
        friendOneId: updatedFriendReq.ReceiverId,
        friendTwoId: updatedFriendReq.SenderId,
      },
      include: {
        friendTwo: true,
      }
    })

  // return updated friend requests for front end notifications

    const updatedFriendRequests = await prisma.friendRequest.findMany({
      where: {
        ReceiverId: req.params.receiverProfileId,
      },
      include: {
        Sender: true,
      }
    });

    return res.status(200).json({
      updatedFriendRequests,
      success: true,
      senderProfile: createdFriendLink.friendTwo,
    });

  } catch (err) {
    return res.status(401).json({
      message: 'Something went wrong. Try again later...',
    });
  }
}

module.exports = {
  getProfileFriends,
  sendFriendReq,
  getPendingFriendReq,
  updateReceiverFriendReq,
};
