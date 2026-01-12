const prisma = require("../db/prismaClient.js");
const { validationResult } = require("express-validator");
const { validateGroupChatMsg } = require("../validators/msgValidators.js");
const he = require("he");

const postChatMsg = [
  validateGroupChatMsg,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      } else {
        const postedMsg = await prisma.message.create({
          data: {
            messageContent: he.decode(req.body.messageContent),
            groupId: req.body.groupId,
            authorId: req.body.authorId,
            attatchedImagePath: req.file.path ? req.file.path : null, 
          },
        });
        return res.status(200).json({
          postedMsg,
        });
      }
    } catch (err) {
      if (err) {
        return res.status(401).json({ message: "Something went wrong..." });
      }
    }
  },
];

module.exports = {
  postChatMsg,
};
