const prisma = require("../db/prismaClient.js");
const { returnUserObjFromToken } = require("../utils/userQuery.js");
const { validationResult } = require("express-validator");
const {
  validateProfileUpdate,
} = require("../validators/updateProfileValidator.js");
const he = require("he");

const getUserProfile = async (req, res) => {
  try {
    const user = returnUserObjFromToken(req.headers.authorization);
    const userProfile = await prisma.profile.findFirst({
      where: {
        userId: user.id,
      },
    });
    return res.status(200).json({ profile: userProfile });
  } catch (err) {
    if (err) {
      return res.status(401).json({ message: "Something went wrong" });
    }
  }
};

const updateProfileInfo = [ validateProfileUpdate, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      const dataObjCheckForFile = req.file
        ? {
            profileName: he.decode(req.body.profileName),
            bio: he.decode(req.body.bio),
            profileImgFilePath: he.decode(req.file.path),
          }
        : {
            profileName: he.decode(req.body.profileName),
            bio: he.decode(req.body.bio),
          };

      const updatedProfile = await prisma.profile.update({
        where: {
          id: req.body.profileId,
        },
        data: dataObjCheckForFile,
      });
      if (updatedProfile) {
        return res
          .status(200)
          .json({ success: true, message: "Your profile was updated!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Something went wrong..." });
      }
    }
  } catch (err) {
    if (err) {
      console.error(err);
      return res
        .status(401)
        .json({ success: false, message: "Something went wrong..." });
    }
  }
}];

const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst({
      where: {
        id: req.params.profileId,
      },
    });

    return res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Something went wrong..." });
  }
};

module.exports = {
  getUserProfile,
  updateProfileInfo,
  getProfile,
};
