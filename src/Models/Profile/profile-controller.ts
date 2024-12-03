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
import { requestAuth } from '../../Common/interfaces/auth-types';

import { AppError, NotFoundError, BadRequestError, AuthError, ValidationError } from '../../Common/utils/AppError';

const authService = new AuthService();
@Controller('/profile')
class ProfileController {

    @Get('/me')
    @use(authService.protectedRoute)
    public async getProfile(request: requestAuth, response: Response, next: NextFunction) {
        const id = request.user.profileID; // Get user id, it's gaurenteed to be in the request object after the protectedRoute middleware

        if(!id){
            return next(new BadRequestError('Profile id is required', 400));
        }

        const profile = await profileService.findProfileById(id); // search for the profile in the database

        if (!profile) return next(new NotFoundError('Profile not found', 404)); // validate if the profile exists or not


        // send response to the client
        response.status(200).json({
            message: 'Profile found',
            profile
        });
    }

    @Post('/updateDate')
    @use(authService.protectedRoute)
    public async updateProfile(request: requestAuth, response: Response, next: NextFunction) {
        const data: IProfile = request.body;
        const id = request.user.profileID;
        if(!id || !data){
            return next(new BadRequestError('Profile id and data are required', 400));
        }

        const profile = await profileService.updateProfile(id, data);

        response.status(200).json({
            message: 'Profile updated',
            profile
        });
    }

    @Post('/upload')
    @use(imgConfig)
    @use(uploadMedia)
    @use(authService.protectedRoute)
    public async uploadProfileImage(request: requestAuth, response: Response, next: NextFunction) {

        const data = {
            photo: `profile-${request.user.profileID}.jpeg`
        } as IProfile;

        const id = request.user.profileID;
        const profile = await profileService.updateProfile(id, data);

        response.status(200).json({
            message: 'Image uploaded',
            profile
        });
    }
}