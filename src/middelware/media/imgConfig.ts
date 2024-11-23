import { Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import { requestBody } from '../../interfaces/requestBody';
import sharp from "sharp";

export const imgConfig = async (request: requestBody, response: Response, next: NextFunction) => {
    const imgPath = `profile-${request.user.profileID}.jpeg`;
    if (!request.file) return next(new AppError('Please upload an image', 400));
    request.file.filename = imgPath;

    await sharp(request.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/profile/${imgPath}`);

    next();
};