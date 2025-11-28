const prisma = require("../db/prismaClient.js");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { returnUserObjFromToken } = require("../utils/userQuery.js");
const { validateCreateGroup } = require("../validators/groupValidators.js");

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

const getSearchedGroups = async (req, res) => {
  try {
    if (req.params.profileId && req.params.groupNameSearching) {
      let parsedResults = [];
      const matchingGroups = await prisma.group.findMany({
        where: {
          groupName: {
            contains: req.params.groupNameSearching,
            mode: "insensitive",
          },
          AND: [
            {
              Member: {
                none: {
                  profileId: req.params.profileId,
                },
              },
            },
          ],
        },
      });

      matchingGroups.forEach((item, indx) => {
        parsedResults.push({ group: item });
      });

      return res.status(200).json(parsedResults);
    }
  } catch (err) {
    console.error(err);
    return res.status(404).json({ message: "Something went wrong..." });
  }
};

const getGroupInfo = async (req, res) => {
  try {
    const groupInfo = await prisma.group.findFirst({
      where: {
        id: req.params.groupId,
      },
    });
    return res.status(200).json(groupInfo);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Something went wrong..." });
  }
};

const createGroup = [
  validateCreateGroup,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      } else {
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
      }
    } catch (err) {
      if (err) {
        console.error(err);
        return res.status(400);
      }
    }
  },
];

const joinRoom = () => {};

const joinGroup = async (req, res) => {
  try {
    await prisma.member.create({
      data: {
        role: "USER",
        profileId: req.params.profileId,
        groupId: req.params.groupId,
      },
    });

    const updatedMemberGroups = await prisma.member.findMany({
      where: {
        profileId: req.params.profileId,
      },
      include: {
        group: true,
      },
    });

    return res.status(200).json({
      updatedMemberGroups: updatedMemberGroups,
      success: true,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Something went wrong...",
      success: false,
    });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const memberItemToRemove = await prisma.member.findFirst({
      where: {
        groupId: req.params.groupId,
        profileId: req.params.profileId,
      },
    });
    if (memberItemToRemove) {
      const removedMember = await prisma.member.delete({
        where: {
          id: memberItemToRemove.id,
        },
      });
      return res.status(200).json({
        success: true,
        removedMember,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Something went wrong...",
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: "Something went wrong...",
      success: false,
    });
  }
};

const getGroupChatMessages = async (req, res) => {
  try {
    const groupChatMsgs = await prisma.message.findMany({
      where: {
        groupId: req.params.groupId,
      },
      include: {
        messageAuthor: true,
      },
    });

    return res.status(200).json(groupChatMsgs);
  } catch (err) {
    return res.status(401).json({ message: "Something went wrong..." });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const userRoleMembers = await prisma.member.findMany({
      where: {
        groupId: req.params.groupId,
        role: "USER",
      },
      include: {
        member: true,
      },
    });
    const adminRoleMembers = await prisma.member.findMany({
      where: {
        groupId: req.params.groupId,
        role: "ADMIN",
      },
      include: {
        member: true,
      },
    });

    return res.status(200).json({
      success: true,
      userRoleMembers,
      adminRoleMembers,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong...",
    });
  }
};

const checkIfAdminInGroup = async (req, res) => {
  try {
    const memberObj = await prisma.member.findFirst({
      where: {
        profileId: req.params.profileId,
        groupId: req.params.groupId,
      },
    });

    return res.status(200).json({
      isAdmin: memberObj && memberObj.role == "ADMIN" ? true : false, 

    });
  } catch (err) {
    if(err) {
      return res.status(401).json({
        error: "Something went wrong..."
      })
    }
  }
};

const removeMember = async (req, res) => {
  try {
    const removedMember = await prisma.member.delete({
      where: {
        profileId: req.params.profileId,
        groupId: req.params.groupId,
      }
    });

    return res.status(200).json({
      removedMember,
    });
  } catch (err) {
    return res.status(401).json({
      error: "Something went wrong...",
    })
  }
};

module.exports = {
  getMemberGroups,
  getSearchedGroups,
  getGroupInfo,
  createGroup,
  joinGroup,
  leaveGroup,
  getGroupChatMessages,
  getGroupMembers,
  checkIfAdminInGroup,
  removeMember
};
