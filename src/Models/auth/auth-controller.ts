import { Request, Response, NextFunction } from 'express';
import passport from './passport-config';
import crypto from 'crypto';

import { Controller } from '../../Common/Decorators/controller';
import { validator } from '../../Common/Decorators/validator';
import { Get, Post } from '../../Common/Decorators/routes';
import { use } from '../../Common/Decorators/use';


import { authService, AuthService } from './../auth/service/auth-service';
import { AccountEntiteDocument } from '../Account/entitie/IAccount';
import { accountService } from '../Account/account-service';
import { profileService } from '../Profile/profile-servies';
import { ProfileDocument } from '../Profile/entitie/IProfile';
import { requestBody } from '../../Common/interfaces/requestBody';
import Emails from '../../Common/utils/Emails/send-email';

import { AppError } from '../../Common/utils/AppError';

interface requestUser {
    user: {
        _id: string,
    }
}

@Controller('/auth')
class AuthController {

    constructor() {
        console.log('Auth controller created');
    }

    @Get('/google')
    @use(passport.authenticate('google', { scope: ['profile', 'email'] }))
    public googleLogin(request: Request, response: Response) { }

    @Get('/google/callback')
    @use(passport.authenticate('google', { failureRedirect: '/fail' }))
    public async googleCallback(request: requestUser, response: Response) {
        const token: string = await new AuthService().createToken(request.user?._id, response);
        response.redirect('/ecommerce/auth/authDone');
    }

    @Get('/authDone')
    public authDone(request: Request, response: Response) {
        console.log(request)
        response.status(200).json({
            message: 'User authenticated',
            user: request.user,
            token: request.headers.cookie?.split('=')[1]
        })
    }

    @Get('/fail')
    public fail(request: Request, response: Response) {
        response.status(401).json({
            message: 'Authentication failed'
        })
    }

    @Post('/login')
    @validator('email', 'password')
    public async login(request: Request, response: Response, next: NextFunction) {
        const { email, password } = request.body;

        const account = await accountService.findAccountByEmail(email);

        if (!account) return next(new AppError('Account not found', 404));

        const profile = await profileService.findProfileById(account.profileID);

        // password check by using database password
        if (!account.password || !await account.comparePassword(password, account.password)) return next(new AppError('Password is incorrect', 401));

        // create a token and send it to the user
        const token: string = await new AuthService().createToken(account._id as string, response);

        request.user = {
            id: account._id,
            email: account.email,
            role: profile.role
        }

        response.status(200).json({
            message: 'success',
            user: request.user,
            token
        })
    }

    @Post('/register')
    @validator('email', 'password', 'confirmPassword')
    public async register(request: Request, response: Response, next: NextFunction) {
        const { email, password, confirmPassword } = request.body;

        const account = await accountService.createAccount(email, password, confirmPassword, next) as AccountEntiteDocument;

        if (!account) return next();

        const profilePayload = {
            name: email.split('@')[0] as string,
            role: 'user'
        } as ProfileDocument;
        const profile = await profileService.createProfile(profilePayload);

        account.profileID = profile._id as string;
        await account.save({ validateBeforeSave: false });

        // create a token and send it to the user
        const token: string = await new AuthService().createToken(account._id as string, response);

        request.user = {
            id: account._id,
            email: account.email,
            role: profile.role
        }

        response.status(200).json({
            message: 'success',
            user: request.user,
            token
        })

    }

    @Get('/logout')
    public logout(request: Request, response: Response) {
        response.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        response.status(200).json({
            message: 'success'
        })
    }

    @Post('/resetPassword')
    @use(authService.protectedRoute)
    @validator('password', 'confirmPassword')
    public async resetPassword(request: requestBody, response: Response, next: NextFunction) {
        const { password, confirmPassword } = request.body;
        console.log(password, confirmPassword)
        if (!password || !confirmPassword || password !== confirmPassword) {
            return next(new AppError('both passwords not matched', 401));
        }

        const email = request.user.email;

        const account = await accountService.findAccountByEmail(email);
        if (!account) {
            return next(new AppError('Account Not founded', 404));
        }

        account.password = password;
        account.confirmPassword = confirmPassword;
        account.passwordChangedTime = new Date();

        await account.save(
            { validateBeforeSave: false }
        );

        response.status(200).json({
            message: "password reset succesfully, please login again",
        })
    }

    @Post('/forgotPassword')
    @validator('email')
    public async forgotPassword(request: Request, response: Response, next: NextFunction) {
        const { email } = request.body;
        const account = await accountService.findAccountByEmail(email);
        if (!account) return next(new AppError('Account not found', 404));

        const token = await account.createPasswordResetToken();
        await account.save({ validateBeforeSave: false });


        const resetURL = `${request.protocol}://${request.get('host')}/ecommerce/auth/resetPassword/${token}`;
        const message = `e-commerce team.\nvisit this link to reset your password ${resetURL}`;
        const subject = 'Password reset token (valid for 10 minutes)';

        await new Emails(email).resetTokenEmail(subject, message);

        response.status(200).json({
            message: 'Reset token sent to your email'
        })
    }

    @Post('/resetPassword/:token')
    @validator('password', 'confirmPassword')
    public async resetPasswordWithToken(request: Request, response: Response, next: NextFunction) {
        const { token } = request.params;
        const { password, confirmPassword } = request.body;

        if (!password || !confirmPassword || password !== confirmPassword) {
            return next(new AppError('both passwords not matched', 401));
        }

        const decodedToken = await crypto.createHash('sha256').update(token).digest('hex');
        console.log(decodedToken)
        const account = await accountService.findAccountByToken(decodedToken);
        if (!account) return next(new AppError('Token is invalid or expired', 401));

        account.password = password;
        account.confirmPassword = confirmPassword;
        account.passwordChangedTime = new Date();

        account.resetToken = undefined;
        account.expireResetToken = undefined;

        await account.save(
            { validateBeforeSave: false }
        );

        response.status(200).json({
            message: "password reset succesfully, please login again",
        })
    }
}