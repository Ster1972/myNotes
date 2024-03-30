const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models/Note.js')



function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }

            bcrypt.compare(password, user.password, (err, isMatch)=> {
                if (err) {
                    console.log(err);
                    return done(err)
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' })
                }
                
            });
        } catch (error) {
            console.log(error)
            return done(error);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch {
            console.log(error);
            done(error)
        }
        
    });
}

module.exports = initialize