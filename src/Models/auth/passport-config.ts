import passport from "passport";

import { AccountService } from "../Account/account-service";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.URL as string
}

passport.use(
    new GoogleStrategy(googleOptions,
        async (accessToken, refreshToken, profile, done) => {

            const { name, email } = profile._json; // extract email from profile

            const accountService = new AccountService(); // create account service instance

            let user = await accountService.findAccountByEmail(email as string); // search for user in db

            if (!user) { // if user not found in db, create new account for user
                const user = await accountService.OauthAccount(email as string);
                return done(null, user); // return user
            }

            return done(null, user); // return user if found in db
        })
);


passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    done(null, user);
});


export default passport;