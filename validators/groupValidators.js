const { body } = require('express-validator');

const validateCreateGroup = [
  body('groupName').trim().escape()
    .notEmpty().withMessage('Group name missing')
    .isLength({max: 35}).withMessage('Group name is too long. Must be less than 35 characters.')
];

module.exports = {
  validateCreateGroup,
};