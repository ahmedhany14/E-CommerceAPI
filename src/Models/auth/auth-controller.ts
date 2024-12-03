import { Request, Response, NextFunction } from 'express';
import passport from './passport-config';
import crypto from 'crypto';

import { Controller } from '../../Common/Decorators/controller';
import { validator } from '../../Common/Decorators/validator';
import { Get, Post } from '../../Common/Decorators/routes';
import { use } from '../../Common/Decorators/use';


import { authService, AuthService } from './../auth/service/auth-service';
import { AccountEntiteDocument } from '../Account/entitie/IAccount';
import { ProfileDocument } from '../Profile/entitie/IProfile';
import { accountService } from '../Account/account-service';
import { profileService } from '../Profile/profile-servies';

import Emails from '../../Common/utils/Emails/send-email';


import { requestAuth } from '../../Common/interfaces/auth-types';

import { AppError, AuthError, BadRequestError, NotFoundError, ValidationError } from '../../Common/utils/AppError';

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
    public async googleCallback(request: requestAuth, response: Response) {
        request.token = await new AuthService().createToken(request.user.id, response);
        response.redirect('/ecommerce/auth/authDone');
    }

    @Get('/authDone')
    public authDone(request: requestAuth, response: Response) {

        response.status(200).json({
            message: 'User authenticated',
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
    public async login(request: requestAuth, response: Response, next: NextFunction) {
        const { email, password } = request.body;

        if (!email || !password) {
            return next(new BadRequestError('Please provide email and password', 400));
        }

        const account = await accountService.findAccountByEmail(email) ||
                        await accountService.findAccountByEmail(email, false);

        if (!account) {
            return next(new NotFoundError('Account not found', 404));
        }

        if(account.active === false){
            return next(new AuthError('The account is not active', 401));
        }

        // password check by using database password
        if (!account.password || !await account.comparePassword(password, account.password)) {
            return next(new AuthError('Password is incorrect', 401));
        }

        // create a token and send it to the user
        const token: string = await new AuthService().createToken(account._id as string, response);

        request.user = {
            id: account._id as string,
            profileID: account.profileID as string,
            email: account.email,
            role: account.role
        }

        response.status(200).json({
            message: 'success',
            user: request.user,
            token
        })
    }

    @Post('/register')
    @validator('email', 'password', 'confirmPassword')
    public async register(request: requestAuth, response: Response, next: NextFunction) {
        const { email, password, confirmPassword } = request.body;

        if (!email || !password || !confirmPassword) {
            return next(new BadRequestError('Please provide email, password and confirmPassword', 400));
        }

        const account = await accountService.createAccount(email, password, confirmPassword, next) as AccountEntiteDocument;

        if (!account) {
            return next(new ValidationError('Account not created', 400));
        }

        const profilePayload = {
            name: email.split('@')[0] as string,
        } as ProfileDocument;

        const profile = await profileService.createProfile(profilePayload);

        account.profileID = profile._id as string;

        await account.save({ validateBeforeSave: false });

        // create a token and send it to the user
        const token: string = await new AuthService().createToken(account._id as string, response);

        request.user = {
            id: account._id as string,
            profileID: account.profileID,
            email: account.email,
            role: account.role
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
    @validator('password', 'confirmPassword')
    @use(authService.protectedRoute)
    public async resetPassword(request: requestAuth, response: Response, next: NextFunction) {
        const { password, confirmPassword } = request.body;

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

        if (!email) {
            return next(new ValidationError('Please provide email', 400));
        }

        const account = await accountService.findAccountByEmail(email);
        if (!account) {
            return next(new NotFoundError('Account not found', 404));
        }

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

        if (!token || !password || !confirmPassword) {
            return next(new ValidationError('Please provide token, password and confirmPassword', 400));
        }
        if (password !== confirmPassword) {
            return next(new AppError('both passwords not matched', 401));
        }

        const decodedToken = await crypto.createHash('sha256').update(token).digest('hex');

        const account = await accountService.findAccountByToken(decodedToken);
        if (!account) {
            return next(new NotFoundError('Account not found', 404));
        }

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