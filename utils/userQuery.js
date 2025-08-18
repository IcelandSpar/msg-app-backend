const prisma = require('../db/prismaClient.js');
const jwt = require('jsonwebtoken');

const checkIfUserExists = async (submittedUsername) => {
  const user = await prisma.user.findFirst({
    where: {
      username: submittedUsername,
    },
  });
  return !!user;
};

const returnUserObjFromToken = (reqHeaderAuth) => {
  const token = (reqHeaderAuth).split(' ')[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  return user;
}


const deleteFileSubmitted = (fileSubmitted) => fileSubmitted ? fs.unlink(fileSubmitted.path) : null;


module.exports = {
  checkIfUserExists,
  deleteFileSubmitted,
  returnUserObjFromToken,
}