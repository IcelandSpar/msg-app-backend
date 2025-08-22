const prisma = require('../db/prismaClient.js');

const postChatMsg = async (req, res) => {
  try {
    const postedMsg = await prisma.message.create({
      data: {
        messageContent: req.body.messageContent,
        groupId: req.body.groupId,
        authorId: req.body.authorId,
      },
    });
    return res.status(200).json(postedMsg);
  } catch (err) {
    if(err) {
      return res.status(401).json({ message: 'Something went wrong...' })
    }
  }
};

module.exports = {
  postChatMsg,
}