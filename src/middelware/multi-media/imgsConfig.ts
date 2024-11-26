import { Response, NextFunction } from "express";
import sharp from "sharp";


import { requestMedia } from './types/requestMedia';
import { AppError } from "../../Common/utils/AppError";

export async function imgConfig(request: requestMedia, response: Response, next: NextFunction): Promise<void> {

    if (!request.files || !request.files.images) return next(new AppError('Please upload an image', 400));

    request.body.images = [String];
    await Promise.all(request.files.images.map(async (file: any) => {
        const name = file.originalname.split('.')[0];
        const imgPath = `product-${request.params.productId}-${name}.jpeg`;
        await sharp(file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`photos/products/${imgPath}`);

        request.body.images.push(imgPath);
    }));

    next();
}