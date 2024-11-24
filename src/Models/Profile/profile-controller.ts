import { Request, Response, NextFunction } from 'express';

import { profileService } from './profile-servies';
import { Controller } from "../../Decorators/controller";
import { Get, Post } from "../../Decorators/routes";
import { use } from "../../Decorators/use";
import { AppError } from '../../utils/AppError';
import { requestBody } from './../../interfaces/requestBody';
import { AuthService } from '../auth/service/auth-service';
import { ProfileUpdateData } from './../../interfaces/profileUpdateData';
import { uploadMedia } from '../../middelware/media/singleMediaConfig';
import { imgConfig } from '../../middelware/media/imgConfig';
import { validator } from '../../Decorators/validator';

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

    @Post('/update')
    @use(authService.protectedRoute)
    public async updateProfile(request: requestBody, response: Response, next: NextFunction) {
        const data: ProfileUpdateData = request.body;
        const id = request.user.profileID;

        const profile = await profileService.updateProfile(id, data);

        response.status(200).json({
            message: 'Profile updated',
            profile
        });
    }

    @Post('/upload')
    @use(authService.protectedRoute)
    @use(uploadMedia)
    public async uploadProfileImage(request: requestBody, response: Response, next: NextFunction) {
        if (!request.file) return next(new AppError('Please upload an image', 400));
        await imgConfig(request);

        const data = {
            photo: `profile-${request.user.profileID}.jpeg`
        }
        const id = request.user.profileID;
        const profile = await profileService.updateProfile(id, data);

        response.status(200).json({
            message: 'Image uploaded',
            profile
        });
    }

    @Post('/upgrade')
    @use(authService.protectedRoute)
    @validator('nationalNumber')
    public async upgradeToSeller(request: requestBody, response: Response, next: NextFunction) {
        const id = request.user.profileID;
        const data = {
            role: 'seller',
            nationalNumber: request.body.nationalNumber as string
        }
        const profile = await profileService.updateProfile(id, data);
        response.status(200).json({
            message: 'Profile upgraded',
            profile
        });
    }
}