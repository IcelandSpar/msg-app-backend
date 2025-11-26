const { validateProfileInfo } = require("../validators/registerValidator.js");

const validateProfileUpdate = [
  ...validateProfileInfo,
];

module.exports = {
  validateProfileUpdate,
};