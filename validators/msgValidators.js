const { body } = require('express-validator');


const validateGroupChatMsg = [
  body('messageContent').trim().escape()
    .notEmpty().withMessage('Message must not be empty')
    .isLength({min: 1, max: 2000}).withMessage('Message can only be 1 - 2000 characters long'),
  body('groupId').trim()
    .notEmpty().withMessage('Group info missing. You may need to refresh or log back in.')
    .isUUID().withMessage('Wrong group format. You may need to refresh or log back in.'),
  body('authorId').trim()
    .notEmpty().withMessage('Author info missing. You may need to refresh or log back in.')
    .isUUID().withMessage('Wrong author format. You may need to refresh or log back in.')
];

const validateDirectMsg = [
  body('message').trim().escape()
    .notEmpty().withMessage('Message must not be empty')
    .isLength({min: 1, max: 2000}).withMessage('Message can only be 1 - 2000 characters long'),
  body('directMessageGroupId').trim()
    .notEmpty().withMessage('Group info missing. You may need to refresh or log back in.')
    .isUUID().withMessage('Wrong group format. You may need to refresh or log back in.'),
  body('authorId').trim()
    .notEmpty().withMessage('Author info missing You may need to refresh or log back in.')
    .isUUID().withMessage('Wrong author format. You may need to refresh or log back in.')
];

module.exports = {
  validateGroupChatMsg,
  validateDirectMsg,
}