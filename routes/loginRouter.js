const { Router } = require('express');
const loginRouter = Router();
const passport = require('passport');
const { loginUser } = require('../controllers/loginController.js');
const jwt = require('jsonwebtoken');

loginRouter.post('/', (req, res, next) => {

  passport.authenticate('local', { session: false },
    (err, user, info) => {
      if(err || !user) {
        return res.status(400).json({
          message: 'Something is not right',
        });
      }
      req.login(user, { session: false }, (err) => {
        if(err) {
          res.send(err);
        };
        const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1m' });
        return res.json({token});
      });
    })(req, res);


}, loginUser)

module.exports = loginRouter;