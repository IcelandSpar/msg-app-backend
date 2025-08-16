const prisma = require("../db/prismaClient.js");
const bcrypt = require("bcryptjs");
const fs = require('node:fs/promises');


const checkIfUserExists = async (submittedUsername) => {
  const user = await prisma.user.findFirst({
    where: {
      username: submittedUsername,
    },
  });
  return !!user;
};


const deleteFileSubmitted = (fileSubmitted) => fileSubmitted ? fs.unlink(fileSubmitted.path) : null;




const createAccount = async (req, res, next) => {
  try {
    if ( await checkIfUserExists(req.body.username) ) {

      deleteFileSubmitted(req.file);
      
      return res.status(409)
      .json({ message: "username already exists", file: req.file });

    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      const createdUser = await prisma.user.create({
        data: {
          username: req.body.username,
          password: hash,
        },
      });


      

      await prisma.profile.create({
        data: {
          profileName: req.body.profileName,
          bio: req.body.bio,
          profileImgFilePath: req.file ? req.file.path : 'public/profile-images/anonymous.png',
          userId: createdUser.id,
        }
      })


      return res.status(201).json({ success: true })
    }
  } catch (err) {
    console.error(err);
    next(err);
  }

};

module.exports = {
  createAccount,
};
