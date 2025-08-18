const prisma = require('../db/prismaClient.js');
const checkIfUserExists = async (submittedUsername) => {
  const user = await prisma.user.findFirst({
    where: {
      username: submittedUsername,
    },
  });
  return !!user;
};


const deleteFileSubmitted = (fileSubmitted) => fileSubmitted ? fs.unlink(fileSubmitted.path) : null;


module.exports = {
  checkIfUserExists,
  deleteFileSubmitted,
}