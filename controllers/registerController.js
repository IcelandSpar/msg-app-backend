const prisma = require('../db/prismaClient.js');
const bcrypt = require('bcryptjs');

const createAccount = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash =  await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
      data: {
        username: req.body.username,
        password: hash,
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


module.exports = {
  createAccount,
}