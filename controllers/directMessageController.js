const prisma = require("../db/prismaClient.js");

const getDirectMessages = async (req, res) => {
  try {
    const directMessages = await prisma.directMessage.findMany({
      where: {
        directMessageGroupId: req.params.directMessageGroupId,
      },
      include: {
        author: true,
      }
    });
    return res.status(200).json({
      success: true,
      directMessages: directMessages,
    });
  } catch (err) {
    
      return res.status(404).json({ success: false ,message: "Something went wrong..." });
    
  }
};

const postMessage = async (req, res) => {
  try {
    const messagePosted = await prisma.directMessage.create({
      data: {
        authorId: req.body.authorId,
        directMessageGroupId: req.body.directMessageGroupId,
        messageContent: req.body.message,
      },
    });

    const updatedDirectMessages = await prisma.directMessage.findMany({
      where: {
        directMessageGroupId: directMessageGroupId,
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
  } catch (err) {
    if (err) {
      console.error(err);
    }
  }
};

module.exports = {
  getDirectMessages,
  postMessage,
};
