import { Request, Response, NextFunction } from 'express';

import { profileService } from './profile-servies';
import { Controller } from "../../Decorators/controller";
import { Get } from "../../Decorators/routes";
import { use } from "../../Decorators/use";
import { AppError } from '../../utils/AppError';
import { requestBody } from './../../interfaces/requestBody';
import { AuthService } from '../auth/service/auth-service';

const authService = new AuthService();
@Controller('/profile')
class ProfileController {

    @Get('/')
    @use(authService.protectedRoute)
    public async getProfile(request: requestBody, response: Response, next: NextFunction) {
        const id = request.user.profileID;
        const profile = await profileService.findProfileById(id);
        if (!profile) return next(new AppError('Profile not found', 404));
        response.status(200).json({
            message: 'Profile found',
            profile
        });
    }
}