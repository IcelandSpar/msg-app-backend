const { body } = require("express-validator");

const validateProfileInfo = [
  body('profileName').trim().escape()
    .notEmpty().withMessage('Profile name is empty')
    .isLength({min: 1, max: 18}).withMessage('Profile name must be within 1 - 18 characters'),
  body('bio').trim().escape()
    .notEmpty().withMessage('Bio is empty')
    .isLength({min: 1, max: 190}).withMessage('Bio must be within 1 - 190 characters')
];

module.exports = {
  validateProfileInfo
};