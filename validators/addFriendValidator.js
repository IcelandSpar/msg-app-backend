const { body } = require('express-validator');

const validateAddFriend = [
  body('friendCode').trim()
    .notEmpty().withMessage('Friend Info is missing. You may need to refresh')
    .isLength({min: 10, max: 10}).withMessage('Incorrect format. Friend code must be 10 characters long'),
  body('profileIdRequesting').trim()
    .notEmpty().withMessage('Profile information missing. You may need to refresh')
    .isUUID().withMessage('Incorrect format. You may need to refresh')
  
];

module.exports = {
  validateAddFriend,
};