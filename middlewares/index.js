const _passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const _cors = require("cors");
const _logger = require("morgan");
const bodyParser = require("body-parser");

const { Users } = require("../models");
const { toPascalCase, stringifyMe } = require("../utils");

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
      const user = await Users.findOne({
        where: { email: payload.email },
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        done(null, false);
      }

      done(null, stringifyMe(user));
    } catch (err) {
      console.error(err);
    }
  })
);

const trimFields = (req, _, next) => {
  req.body.fullName && (req.body.fullName = toPascalCase(req.body.fullName));
  req.body.userName && (req.body.userName = req.body.userName.trim());
  req.body.bio && (req.body.bio = req.body.bio.trim());
  req.body.email && (req.body.email = req.body.email.toLowerCase());
  !req.body.dob && (req.body.dob = null);
  next();
};

module.exports = {
  passport: _passport.initialize(),
  cors: _cors(corsOptions),
  authenticate: _passport.authenticate("jwt", { session: false }),
  json: bodyParser.json(),
  urlencoded: bodyParser.urlencoded({ extended: true }),
  logger: _logger("dev"),
  trimFields,
};
