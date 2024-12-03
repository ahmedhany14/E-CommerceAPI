import passport from "passport";

import { AccountService } from "../Account/account-service";
import { profileService } from "../Profile/profile-servies";
import { ProfileDocument } from "../Profile/entitie/IProfile";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { AccountEntiteDocument } from './../Account/entitie/IAccount'

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

                const profileDate = {
                    name: name as string
                } as ProfileDocument;

                const profile = await profileService.createProfile(profileDate); // create profile for user

                const user = await accountService.OauthAccount(email as string, profile._id as string); // create account for user

                return done(null, user); // return user
            }
            else if (user.active === false) { // if user is not active
                return done(null, false, { message: 'Your account is not active' }); // return error message
            }
            return done(null, user); // return user if found in db
        })
);


passport.serializeUser((userInfo: any, done) => {
    done(null, userInfo);
});

passport.deserializeUser((userInfo: any, done) => {
    done(null, userInfo);
});


export default passport;