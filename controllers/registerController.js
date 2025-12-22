const prisma = require("../db/prismaClient.js");
const bcrypt = require("bcryptjs");
const fs = require('node:fs/promises');
const crypto = require('node:crypto');
const he = require("he");

const { validationResult, matchedData } = require('express-validator');
const { validateLogin } = require('../validators/loginValidator.js');
const { validateProfileInfo } = require('../validators/registerValidator.js');


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


const createAccount = [ validateProfileInfo, validateLogin, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(he.decode(req.body.password) != he.decode(req.body.confirmPassword)) {
      errors.errors.push({
        type: 'field',
        value: '',
        msg: 'Passwords do not match',
        location: 'body',
      })
    }
    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else if ( await checkIfUserExists(he.decode(req.body.username)) ) {

      deleteFileSubmitted(req.file);
      
      return res.status(409)
      .json({ message: "username already exists", file: req.file });

    } else {
      const hash = await bcrypt.hash(he.decode(req.body.password), 10);
      const createdUser = await prisma.user.create({
        data: {
          username: he.decode(req.body.username),
          password: hash,
        },
      });


      const shortenedHash = await returnAvailableFriendCode();


      await prisma.profile.create({
        data: {
          profileName: he.decode(req.body.profileName),
          bio: he.decode(req.body.bio),
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

}];

module.exports = {
  createAccount,
};
