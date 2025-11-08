const { body } = require('express-validator');

const validateLogin = [
  body("username").trim().escape()
  .notEmpty().withMessage('Username must not be empty')
  .isLength({min: 5, max: 25}).withMessage('Username must be between 5 - 25 characters'),
  body("password").trim().escape()
  .notEmpty().withMessage('Password must not be empty')
  .isLength({min: 5, max: 25}).withMessage('Password must be between 5 - 25 characters')
];

module.exports = {
  validateLogin
};