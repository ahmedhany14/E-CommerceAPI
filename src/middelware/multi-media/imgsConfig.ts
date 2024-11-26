import { Response, NextFunction } from "express";
import sharp from "sharp";


import { requestMedia } from './types/requestMedia';


export async function imgConfig(request: requestMedia, response: Response, next: NextFunction): Promise<void> {

    request.body.images = [String];
    await Promise.all(request.files.images.map(async (file: any, index) => {
        const imgPath = `product-${request.body.productId}.jpeg`;
        await sharp(file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`photos/product/${imgPath}`);

        request.body.images.push(imgPath);
    }));

    next();
}