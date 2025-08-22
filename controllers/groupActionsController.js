const prisma = require("../db/prismaClient.js");
const jwt = require("jsonwebtoken");
const { returnUserObjFromToken } = require("../utils/userQuery.js");

const getMemberGroups = async (req, res) => {
  try {
    const userObj = returnUserObjFromToken(req.headers.authorization);

    const userProfile = await prisma.profile.findFirst({
      where: {
        userId: userObj.id,
      },
    });

    const memberGroups = await prisma.member.findMany({
      where: {
        profileId: userProfile.id,
      },
      include: {
        group: true,
      },
    });
    return res.status(200).json(memberGroups);
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Something went wrong...",
    });
  }
};

const createGroup = async (req, res) => {
  try {
    const user = returnUserObjFromToken(req.headers.authorization);

    const userProfile = await prisma.profile.findFirst({
      where: {
        userId: user.id,
      },
    });

    const createdGroup = await prisma.group.create({
      data: {
        groupName: req.body.groupName,
        groupImgPath: req.file
          ? req.file.path
          : "public/profile-images/anonymous.png",
        creatorId: userProfile.id,
      },
    });

    const createdMember = await prisma.member.create({
      data: {
        role: "ADMIN",
        profileId: userProfile.id,
        groupId: createdGroup.id,
      },
    });

    res.status(200).json({
      createdGroup: createdGroup,
      createdMember: createdMember,
    });
  } catch (err) {
    if (err) {
      console.error(err);
      return res.status(400);
    }
  }
};

const joinRoom = () => {};

const getGroupChatMessages = async (req, res) => {
  try {
    const groupChatMsgs = await prisma.message.findMany({
      where: {
        groupId: req.params.groupId,
      },
      include: {
        messageAuthor: true,
      }
    });

    return res.status(200).json(groupChatMsgs);
  } catch (err) {
    return res.status(401).json({ message: "Something went wrong..." });
  }
};



module.exports = {
  getMemberGroups,
  createGroup,
  getGroupChatMessages,
};
