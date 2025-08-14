const { Router } = require('express');
const { createAccount } = require('../controllers/registerController.js');
const registerRouter = Router();


registerRouter.post('/', createAccount);


module.exports = registerRouter;
