import * as passport from 'passport';
import * as JwtPassport from 'passport-jwt';
import User from '../models/User.model';
// import logger from '../handlers/logHandler';

const JwtStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET
};

passport.use(
	new JwtStrategy(opts, async (jwtPayload, done) => {
		try {
			const user = await User.findById(jwtPayload._id);
			done(null, user ? user : false);
		} catch (ex) {
			// logger.log('error', ex);
			done(null, false);
		}
	})
);
