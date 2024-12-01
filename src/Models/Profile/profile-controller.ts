import { Response, NextFunction } from 'express';

import { Controller } from "../../Common/Decorators/controller";
import { validator } from '../../Common/Decorators/validator';
import { Get, Post } from "../../Common/Decorators/routes";
import { use } from "../../Common/Decorators/use";

import { AuthService } from '../auth/service/auth-service';
import { profileService } from './profile-servies';

import { uploadMedia } from '../../middelware/media/singleMediaConfig';
import { imgConfig } from '../../middelware/media/imgConfig';

import { IProfile } from './entitie/IProfile';
import { requestBody } from '../../Common/interfaces/auth-types';

import { AppError } from '../../Common/utils/AppError';

const authService = new AuthService();
@Controller('/profile')
class ProfileController {

    @Get('/me')
    @use(authService.protectedRoute)
    public async getProfile(request: requestBody, response: Response, next: NextFunction) {
        const id = request.userInfo.profileID;
        const profile = await profileService.findProfileById(id);
        if (!profile) return next(new AppError('Profile not found', 404));
        response.status(200).json({
            message: 'Profile found',
            profile
        });
    }

    @Post('/updateDate')
    @use(authService.protectedRoute)
    public async updateProfile(request: requestBody, response: Response, next: NextFunction) {
        const data: IProfile = request.body;
        const id = request.userInfo.profileID;

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
            photo: `profile-${request.userInfo.profileID}.jpeg`
        } as IProfile;
        const id = request.userInfo.profileID;
        const profile = await profileService.updateProfile(id, data);

        response.status(200).json({
            message: 'Image uploaded',
            profile
        });
    }

    /*
    @Post('/upgrade')
    @use(authService.protectedRoute)
    @validator('nationalNumber')
    public async upgradeToSeller(request: requestBody, response: Response, next: NextFunction) {
        const id = request.user.profileID;
        const data = {
            role: 'seller',
            nationalNumber: request.body.nationalNumber as string
        } as IProfile;
        const profile = await profileService.updateProfile(id, data);
        response.status(200).json({
            message: 'Profile upgraded',
            profile
        });
    }*/
}