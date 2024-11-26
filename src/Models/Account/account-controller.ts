import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

import { authService } from '../auth/service/auth-service';
import { accountService } from './account-service';


import { Delete, Get, Post } from '../../Common/Decorators/routes';
import { validator } from '../../Common/Decorators/validator';
import { Controller } from '../../Common/Decorators/controller';
import { use } from '../../Common/Decorators/use';

import Emails from '../../Common/utils/Emails/send-email';

import { requestBody } from '../../Common/interfaces/requestBody';

import { AppError } from '../../Common/utils/AppError';

@Controller('/account')
class AccountController {

    @Delete('/')
    @use(authService.protectedRoute)
    public async deleteAccount(request: requestBody, response: Response, next: NextFunction) {
        const id = request.user.id;
        console.log(id);
        await accountService.deactiveAccount(id);

        response.status(204).json({
            status: 'success',
            data: null
        });
    }

    @Post('/active')
    @validator('email')
    async sendTokenToActive(request: Request, response: Response, next: NextFunction) {
        const { email } = request.body;

        const account = await accountService.findAccountByEmail(email, false);

        if (!account) {
            return next(new AppError('There is no account with this email', 404));
        }

        const resetToken = await account.createPasswordResetToken();

        await account.save({ validateBeforeSave: false });

        const resetURL = `${request.protocol}://${request.get('host')}/ecommerce/account/activate/${resetToken}`;

        await new Emails(account.email).resetTokenEmail('Your account activation token (valid for 10 min)', resetURL);

        response.status(200).json({
            status: 'success',
            message: 'activate link sent to email'
        });
    }

    @Get('/activate/:token')
    async activateAccount(request: Request, response: Response, next: NextFunction) {
        const token = request.params.token;
        if (!token) {
            return next(new AppError('Token is invalid or has expired', 400));
        }

        const hashedToken = await crypto.createHash('sha256').update(token).digest('hex');
        const account = await accountService.findAccountByToken(hashedToken);

        if (!account) {
            return next(new AppError('Token is invalid or has expired', 400));
        }

        account.active = true;
        account.resetToken = undefined;
        account.expireResetToken = undefined;

        await account.save({ validateBeforeSave: false });

        response.status(200).json({
            status: 'success',
            message: 'Account activated successfully login now'
        });
    }
}