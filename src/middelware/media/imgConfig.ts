import { NextFunction, Response } from 'express';
import sharp from "sharp";

import { requestAuth } from '../../Common/interfaces/auth-types';
import { NotFoundError } from '../../Common/utils/AppError';

export async function imgConfig(request: requestAuth, response: Response, next: NextFunction): Promise<void> {
    if (!request.file) {
        return next(new NotFoundError('Please upload an image', 400));
    }

    const imgPath = `profile-${request.user.profileID}.jpeg`;
    console.log(imgPath)
    await sharp(request.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`photos/profile/${imgPath}`);

    next();
};