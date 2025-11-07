const { Router } = require("express");
const loginRouter = Router();
const passport = require("passport");
const {  validationResult, matchedData } = require("express-validator");
const { validateLogin } = require("../validators/loginValidator.js");
const { loginUser } = require("../controllers/loginController.js");
const jwt = require("jsonwebtoken");

loginRouter.post("/", validateLogin,(req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
    })
    }
    if (!err || user) {
      req.login(user, { session: false }, (err) => {
        delete user["password"];
        const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: "10h",
        });
        return res.json({ token });
      });
    }
    if (err || !user) {
      return res.status(401).json({
        message: "Something is not right",
      });
    }
  })(req, res);
});

module.exports = loginRouter;
