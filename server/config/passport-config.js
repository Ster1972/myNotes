const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models/Note.js')



function initialize(passport) {
    console.log('entered passport initialize')
    const authenticateUser = async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }

            const isMatch = bcrypt.compareSync(password, user.password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            return done(error);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        return done(null, User.findById(id) )
    });
}

module.exports = initialize