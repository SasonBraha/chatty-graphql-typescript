"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const JwtPassport = require("passport-jwt");
const User_model_1 = require("../Models/User.model");
// import logger from '../handlers/logHandler';
const JwtStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};
passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        const user = await User_model_1.default.findById(jwtPayload._id);
        done(null, user ? user : false);
    }
    catch (ex) {
        // logger.log('error', ex);
        done(null, false);
    }
}));
