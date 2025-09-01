const prisma = require('../db/prismaClient.js');
const { returnUserObjFromToken } = require('../utils/userQuery.js');


const getUserProfile = async (req, res) => {
  try {
    const user = returnUserObjFromToken(req.headers.authorization);
    const userProfile = await prisma.profile.findFirst({
      where: {
        userId: user.id,
      }
    });
    return res.status(200).json({ profile: userProfile });
  } catch (err) {
    if(err) {
    return res.status(401).json({ message: 'Something went wrong' })

    }
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst({
      where: {
        id: req.params.profileId,
      }
    });

    return res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Something went wrong...' })
  }
};

module.exports = {
  getUserProfile,
  getProfile,
}