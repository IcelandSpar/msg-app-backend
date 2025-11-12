const prisma = require("../db/prismaClient.js");
const { validationResult } = require('express-validator');

const { returnUserObjFromToken } = require("../utils/userQuery.js");
const { validateAddFriend } = require('../validators/addFriendValidator.js');

const checkIfFriend = async (req, res) => {
  try {
    const isFriend = await prisma.friend.findFirst({
      where: {
        OR: [
          {
            friendOneId: req.params.userProfileId,
            friendTwoId: req.params.userFriendProfileId,
          },
          {
            friendOneId: req.params.userFriendProfileId,
            friendTwoId: req.params.userProfileId,
          },
        ],
      },
    });

    return res.status(200).json(!!isFriend);
  } catch (err) {
    if (err) {
      return res.status(404).json({ message: "Something went wrong..." });
    }
  }
};

const getProfileFriends = async (req, res) => {
  try {
    const profileFriendList = await prisma.friend.findMany({
      where: {
        OR: [
          {
            friendOneId: req.params.profileId,
          },
          {
            friendTwoId: req.params.profileId,
          },
        ],
      },
      include: {
        friendOne: true,
        friendTwo: true,
      },
    });

    return res.status(200).json(profileFriendList);
  } catch (err) {
    console.error(err);
    res.status(401).json({
      message: "Something went wrong...",
    });
  }
};

const sendFriendReq = [ validateAddFriend, async (req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  } else if (req.body.friendCode && req.body.profileIdRequesting) {
    const reqReceiver = await prisma.profile.findFirst({
      where: {
        friendCode: req.body.friendCode,
      },
    });
    if(!reqReceiver) {
          return res.status(200).json({
            success: true,
            message: "No matching records... Check if friend code is correctly typed.",
          });
    } else if (reqReceiver && reqReceiver.id != req.body.profileIdRequesting) {
      const checkIfAlreadyFriends = await prisma.friend.findMany({
        where: {
          OR: [
            {
              friendOneId: reqReceiver.id,
              friendTwoId: req.body.profileIdRequesting,
            },
            {
              friendOneId: req.body.profileIdRequesting,
              friendTwoId: reqReceiver.id,
            },
          ],
        },
      });
      console.log(checkIfAlreadyFriends);

      if (checkIfAlreadyFriends.length == 0) {
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
}];

const getPendingFriendReq = async (req, res) => {
  try {
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            OR: [
              {
                ReceiverId: req.params.receiverProfileId
              },
              {
                SenderId: req.params.receiverProfileId,
              }
            ],
            status: "PENDING",
          },
          {
            status: "ACCEPTED",
          },
        ],
      },
      include: {
        Sender: true,
        Receiver: true,
      },
    });

    return res.status(200).json(friendRequests);
  } catch (err) {
    if (err) {
      return res.status(401).json({
        message: "Something went wrong...",
      });
    }
  }
};

const updateReceiverFriendReq = async (req, res) => {
  try {
    let createdFriendLink = null;
    let profileFriendList = null;
    const parsedUserFriendReqSelection =
      req.query.isFriendReqAccepted == "true" ? "ACCEPTED" : "DECLINED";

    // update friend request to ACCEPTED or DECLINED

    const updatedFriendReq = await prisma.friendRequest.update({
      where: {
        id: req.params.notificationId,
      },
      data: {
        status: parsedUserFriendReqSelection,
      },
    });

    // create friend link if friend req accepted

    if (parsedUserFriendReqSelection == "ACCEPTED") {
      // creates DM-Group and conects both users to DM-group

      const createdDirectMessageGroup = await prisma.directMessageGroup.create({
        data: {
          friend: {
            create: {
              friendOneId: updatedFriendReq.ReceiverId,
              friendTwoId: updatedFriendReq.SenderId,
            }
          }
        },
        include: {
          friend: true,
        }
      });
    }

    // return updated friend requests for front end notifications

    profileFriendList = await prisma.friend.findMany({
      where: {
        OR: [
          {
            friendOneId: req.params.receiverProfileId,
          },
          {
            friendTwoId: req.params.receiverProfileId,
          },
        ],
      },
      include: {
        friendOne: true,
        friendTwo: true,
      },
    });

        const friendRequests = await prisma.friendRequest.findMany({
      where: {
        ReceiverId: req.params.receiverProfileId,
        OR: [
          {
            status: "PENDING",
          },
          {
            status: "ACCEPTED",
          },
        ],
      },
      include: {
        Sender: true,
      },
    });


    return res.status(200).json({
      updatedFriendRequests: friendRequests,
      profileFriendList,
      success: true,
    });
  } catch (err) {
    if (err) {
      console.error(err);
      return res.status(401).json({
        message: "Something went wrong. Try again later...",
      });
    }
  }
};

const getFriendDirectMessageGroup = async (req, res) => {
  try {



    const dmGroupId = await prisma.directMessageGroup.findFirst({
      where: {
        friend: {
          OR: [
            {
              friendOneId: req.params.senderId,
              friendTwoId: req.params.receiverId,
            },
            {
              friendOneId: req.params.receiverId,
              friendTwoId: req.params.senderId,
            }
          ]
        }
      }
    });


    return res.status(200).json({
      directMessageGroup: dmGroupId,
      success: true,
    });
  } catch (err) {
    if (err) {
      console.error(err);
      return res.status(401).json({
        message: "Something went wrong...",
        success: false,
      });
    }
  }
};

const deleteFriendReq = async (req, res) => {
  try {
    if (req.params.requestId) {
      const deletedFriendRequest = await prisma.friendRequest.delete({
        where: {
          id: req.params.requestId,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Friend request dismissed",
        deletedFriendRequest,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Something went wrong..." });
  }
};

const deleteFriendAndRequests = async (req, res) => {
  try {
    let deletedFriend;

    const friendRowToDelete = await prisma.friend.findFirst({
      where: {
        OR: [
          {
            friendOneId: req.params.userProfileId,
            friendTwoId: req.params.userFriendProfileId,
          },
          {
            friendOneId: req.params.userFriendProfileId,
            friendTwoId: req.params.userProfileId,
          }
        ]
      }
    });


    deletedFriend = await prisma.friend.delete({
      where: {
        id: friendRowToDelete.id,
      }
    });

    await prisma.friendRequest.deleteMany({
      where: {
        OR: [
          {
            SenderId: req.params.userProfileId,
            ReceiverId: req.params.userFriendProfileId,
          },
          {
            SenderId: req.params.userFriendProfileId,
            ReceiverId: req.params.userProfileId,
          },
        ],
      },
    });

      return res.status(200).json({
        success: true,
        message: "User unfriended",
        deletedFriend,
      });
    

  } catch (err) {
    console.error(err)
      return res
        .status(404)
        .json({ success: false, message: "Something went wrong..." });
  }
};

module.exports = {
  checkIfFriend,
  getProfileFriends,
  sendFriendReq,
  getPendingFriendReq,
  updateReceiverFriendReq,
  getFriendDirectMessageGroup,
  deleteFriendReq,
  deleteFriendAndRequests,
};
