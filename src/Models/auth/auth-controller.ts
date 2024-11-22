import passport from './passport-config';
import { Request, Response } from 'express';

import { Controller } from '../../Decorators/controller';
import { Get, Post } from '../../Decorators/routes';
import { use } from '../../Decorators/use';

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
}