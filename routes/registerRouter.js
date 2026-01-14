const { Router } = require("express");
const { createAccount } = require("../controllers/registerController.js");
const registerRouter = Router();
const prisma = require("../db/prismaClient.js");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/profile-images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/svg+xml"
  ) {
    return cb(null, true);
  } else {

    return cb(null, false);
  }
};

const upload = multer({
  storage: storage,

  // dest: './public/profile-images',
  fileFilter: fileFilter,
});

registerRouter.post("/" , upload.single("profilePicture"), createAccount);

module.exports = registerRouter;
