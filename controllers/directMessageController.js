const prisma = require("../db/prismaClient.js");
const { validationResult } = require("express-validator");
const { validateDirectMsg } = require("../validators/msgValidators.js");
const he = require("he");

const getDirectMessages = async (req, res) => {
  try {
    const directMessages = await prisma.directMessage.findMany({
      where: {
        directMessageGroupId: req.params.directMessageGroupId,
      },
      include: {
        author: true,
      },
    });

    const users = await prisma.directMessageGroup.findFirst({
      where: {
        id: req.params.directMessageGroupId,
      },
      include: {
        friend: true,
      }
    });

    const directMessageGroupMembers = await prisma.profile.findMany({
      where: {
        OR: [
          {
            id: users.friend.friendOneId,
          },
          {
            id: users.friend.friendTwoId,
          }
        ]
      }
    });

    let parsedUserRoleMembers = [];

    directMessageGroupMembers.forEach((item, index) => {
      parsedUserRoleMembers.push({
        member: item,
      })
    });
    
    return res.status(200).json({
      success: true,
      directMessages: directMessages,
      directMessageGroupMembers: parsedUserRoleMembers,
    });
  } catch (err) {
    console.log(err)
    return res
      .status(404)
      .json({ success: false, message: "Something went wrong..." });
  }
};

const postMessage = [
  validateDirectMsg,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      } else {
        const messagePosted = await prisma.directMessage.create({
          data: {
            authorId: req.body.authorId,
            directMessageGroupId: req.body.directMessageGroupId,
            messageContent: he.decode(req.body.message),
            attatchedImagePath: req.file ? req.file.path : null,
          },
        });

        const updatedDirectMessages = await prisma.directMessage.findMany({
          where: {
            directMessageGroupId: req.body.directMessageGroupId,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return res.status(200).json({
          success: true,
          message: messagePosted,
          updatedDirectMessages: updatedDirectMessages,
        });
      }
    } catch (err) {
      if (err) {
        console.error(err);
      }
    }
  },
];

module.exports = {
  getDirectMessages,
  postMessage,
};
