import { Request, Response, NextFunction } from 'express';

import { profileService } from './profile-servies';
import { Controller } from "../../Decorators/controller";
import { Get } from "../../Decorators/routes";
import { AppError } from '../../utils/AppError';
import { requestBody } from './../../interfaces/requestBody';

@Controller('/profile')
class ProfileController {

    @Get('/')
    public async getProfile(request: requestBody, response: Response, next: NextFunction) {
        const id = request.user.id;
        const profile = await profileService.findProfileById(id);

        if (!profile) {
            return next(new AppError('Profile not found', 404));
        }

        response.status(200).json({
            message: 'Profile found',
            profile
        });
    }
}