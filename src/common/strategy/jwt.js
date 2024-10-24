const { Strategy, ExtractJwt } = require('passport-jwt')
const asyncHandler = require('express-async-handler');
const UserModel = require('../../models/user');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

const jwtStrategy = new Strategy(opts, asyncHandler(async (payload, done) => {
    const user = await UserModel.findById(payload.id)
    if (!user) {
        done(null, false)
    }
    done(null, user)
}))

module.exports = jwtStrategy