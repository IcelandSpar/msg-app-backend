const prisma = require("../db/prismaClient.js");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });
      const match = await bcrypt.compare(password, user.password);
      if(!match) { cb(null, false, { message: 'Incorrect username or password.' }) };
      
      return cb(null, user, { message: 'Logged in successfully' })
    } catch (err) {
      if(err) { return cb(err) };
    }
  })
);

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: jwt_payload.sub,
        },
      });
      if (user) {
        return done(null, user);
      }
    } catch (err) {
      if (err) {
        return done(err, false);
      }
    }
    return done(null, false);
  })
);
