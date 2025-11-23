const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const db = require("../db.js");
const User = db.users;

dotenv.config();

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8000/google/callback"
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleID: profile.id });
                    
                    if (user) {
                        return done(null, user);
                    }

                    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                    if (!email) {
                        return done(new Error('Email is required'), null);
                    }

                    user = await User.create({
                        googleID: profile.id,
                        email: email,
                        username: profile.displayName,
                    });

                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }
            }
        )
    );
};