const prisma = require("../db/prismaClient.js");
const bcrypt = require("bcryptjs");
const fs = require('node:fs/promises');
const crypto = require('node:crypto');

const { checkIfUserExists, deleteFileSubmitted } = require('../utils/userQuery.js');

const returnAvailableFriendCode = async () => {
      let isFriendCodeAvailable = false;

      let createdHash;
      let shortenedHash;

      while (isFriendCodeAvailable == false) {
        console.log('checking for friend codes...');

      createdHash = crypto.randomBytes(16).toString('hex');
      shortenedHash = createdHash.slice(0, 10);
      const checkIfFriendCodeExists = await prisma.profile.findFirst({
        where: {
          friendCode: shortenedHash,
        }
      });
      if(!!checkIfFriendCodeExists == false) {
        console.log('done!')
        isFriendCodeAvailable = true;
      }
      }
      return shortenedHash

}


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


      const shortenedHash = await returnAvailableFriendCode();


      await prisma.profile.create({
        data: {
          profileName: req.body.profileName,
          bio: req.body.bio,
          profileImgFilePath: req.file ? req.file.path : 'public/profile-images/anonymous.png',
          userId: createdUser.id,
          friendCode: shortenedHash,
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
