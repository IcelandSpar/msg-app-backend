const { Router } = require("express");
const loginRouter = Router();
const passport = require("passport");
const { loginUser } = require("../controllers/loginController.js");
const jwt = require("jsonwebtoken");

loginRouter.post("/", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (!err || user) {
      req.login(user, { session: false }, (err) => {
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
