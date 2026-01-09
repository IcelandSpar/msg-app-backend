const { body } = require('express-validator');

const validateCreateGroup = [
  body('groupName').trim().escape()
    .notEmpty().withMessage('Group name missing')
    .isLength({min: 1, max: 35}).withMessage('Group name must be within 1 to 35 characters.')
];

const validateGroupNameChange = [
  body('groupName').trim().escape()
    .notEmpty().withMessage('Group name missing')
    .isLength({min: 1, max: 35}).withMessage('Group name must be within 1 to 35 characters.')
]

module.exports = {
  validateCreateGroup,
  validateGroupNameChange,
};