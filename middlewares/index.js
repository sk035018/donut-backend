const _passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const _cors = require("cors");
const _logger = require("morgan");
const bodyParser = require("body-parser");

const { users } = require("../models");
const { sanitizedUser } = require("../utils");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
};

_passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await users.findOne({ where: { email: payload.email } });

      if (!user) {
        done(null, false);
      }

      done(null, sanitizedUser(user));
    } catch (err) {
      console.error(err);
    }
  })
);

module.exports = {
  passport: _passport.initialize(),
  cors: _cors(corsOptions),
  authenticate: _passport.authenticate(["jwt",], { session: false, }),
  json: bodyParser.json(),
  urlencoded: bodyParser.urlencoded({ extended: false }),
  logger: _logger("dev"),
};