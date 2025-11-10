const prisma = require("../db/prismaClient.js");
const { validationResult } = require("express-validator");
const { validateDirectMsg } = require("../validators/msgValidators.js");

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
    return res.status(200).json({
      success: true,
      directMessages: directMessages,
    });
  } catch (err) {
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
            messageContent: req.body.message,
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
