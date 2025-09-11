const prisma = require("../db/prismaClient.js");

const postMessage = async (req, res) => {
  try {



       const messagePosted = await prisma.directMessage.create({
        data: {
          authorId: req.body.authorId,
          directMessageGroupId: req.body.directMessageGroupId,
          messageContent: req.body.message,
 
        },
      })


      const updatedDirectMessages = await prisma.directMessage.findMany({
        where: {
          directMessageGroupId: directMessageGroupId,
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

    

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
  postMessage,
};
