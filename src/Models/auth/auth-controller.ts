import passport from './passport-config';
import { Request, Response, NextFunction } from 'express';

import { Controller } from '../../Decorators/controller';
import { Get, Post } from '../../Decorators/routes';
import { use } from '../../Decorators/use';
import { validator } from '../../Decorators/validator';
import { AppError } from '../../utils/AppError';
import { accountService } from '../Account/account-service';
import { profileService } from '../Profile/profile-servies';

interface Account {
    profileID: string;
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
    public googleCallback(request: Request, response: Response) {
        console.log('request.user', request.user);
        response.redirect('/ecommerce/auth/authDone');
    }

    @Get('/authDone')
    public authDone(request: Request, response: Response) {
        response.status(200).json({
            message: 'User authenticated',
            user: request.user
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

        response.status(200).json({
            message: 'success',
            account,
            profile
        })
    }

    @Post('/register')
    @validator('email', 'password', 'confirmPassword')
    public async register(request: Request, response: Response, next: NextFunction) {
        const { email, password, confirmPassword } = request.body;

        const account = await accountService.createAccount(email, password, confirmPassword);

        const profilePayload = {
            name: email.split('@')[0] as string,
            role: 'user'
        }
        const profile = await profileService.createProfile(profilePayload);

        response.status(200).json({
            message: 'success',
            account,
            profile
        })
    }
}