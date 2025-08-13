const prisma = require('../db/prismaClient.js');
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;


passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  try {
      const user = prisma.user.findFirst({
    where: {
      id: jwt_payload.sub
    }
  })
  if(user) {
    return done(null, user);
  }
  } catch(err)  {
    if(err) {
      return done(err, false);
    }
  }
  return done(null, false);

}));

