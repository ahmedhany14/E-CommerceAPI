import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.URL as string
}

passport.use(
    new GoogleStrategy(googleOptions,
        async (accessToken, refreshToken, profile, done) => {

            const { name, email } = profile._json;
            const data = {
                name,
                email
            }
            // save user to db
            /* 
                implementation later........
            */

            return done(null, data);
        })
);


passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {

    /*
        get user from db 
        implementation later........
    */
    done(null, user);
});


export default passport;