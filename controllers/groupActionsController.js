const prisma = require('../db/prismaClient.js');
const jwt = require('jsonwebtoken');

const createGroup = async (req, res) => {
  try {
  const token = (req.headers.authorization).split(' ')[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);

  const userProfile = await prisma.profile.findFirst({
    where: {
      userId: user.id,
    }
  })

  const createdGroup = await prisma.group.create({
    data: {
      groupName: req.body.groupName,
      groupImgPath: req.file ? req.file.path : 'public/profile-images/anonymous.png',
      creatorId: userProfile.id,
    }
  });

  const createdMember = await prisma.member.create({
    data: {
      role: 'ADMIN',
      profileId: userProfile.id,
      groupId: createdGroup.id,
    }
  })

  res.status(200).json({
    createdGroup: createdGroup,
    createdMember: createdMember,
  });
  } catch (err) {
    if(err) {
      console.error(err)
      return res.status(400)
    }
  }

};


module.exports = {
  createGroup,
};