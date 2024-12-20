import { Request, Response, NextFunction } from 'express';

import { Controller } from '../../Common/Decorators/controller';
import { validator } from '../../Common/Decorators/validator';
import { Get, Post } from '../../Common/Decorators/routes'
import { use } from '../../Common/Decorators/use';


import feedbackService from './../FeedBacks/feedback-service'
import { authService } from '../auth/service/auth-service';
import { CartDocument } from './../Cart/entitie/ICart';
import { productService } from './product-service';
import cartService from './../Cart/cart-service'

import { uploadMedia } from '../../middelware/multi-media/uploader';
import { imgConfig } from '../../middelware/multi-media/imgsConfig';


import { requestMedia } from '../../middelware/multi-media/types/requestMedia';
import { requestBody } from '../../Common/interfaces/auth-types';

import { AppError } from '../../Common/utils/AppError';

@Controller('/products')
class ProductController {
    constructor() { }

    @Get('/:category')
    @use(authService.protectedRoute)
    public async getProducts(request: Request, response: Response): Promise<void> {
        const category = request.params.category
        const products = await productService.getProducts(category);
        response.status(200).json({
            status: 'success',
            products
        });
    }

    @Get('/view/:productId')
    @use(authService.protectedRoute)
    public async getProduct(request: Request, response: Response): Promise<void> {
        const product = await productService.getProduct(request.params.productId);
        const review = await feedbackService.getFeedBacks(request.params.productId)
        response.status(200).json({
            status: 'success',
            product,
            review
        });
    }

    @Post('/buy')
    @validator('productsIds')
    @use(authService.protectedRoute)
    public async buyProduct(request: requestBody, response: Response, next: NextFunction) {
        const profileId = request.user.profileID, productsIds = request.body.productsIds;
        if (!productsIds) return next(new AppError('invalid id', 404));

        const price = await productService.getProductsPrice(productsIds);
        if (price === -1) return next(new AppError('error in price', 500));
        const order = {
            buiedAy: new Date(),
            state: 'pending',
            price: price,
            profileID: profileId,
            productsIDs: productsIds
        }

        const cart = await cartService.CreateCart(order as CartDocument);

        response.status(200).json({
            message: "success",
            cart
        })
    }

    @Post('/state')
    @validator('cartId', 'state')
    @use(authService.protectedRoute)
    @use(authService.restrictTo('user'))
    public async stateOfCart(request: requestBody, response: Response, next: NextFunction) {
        const { cartId, state } = request.body;

        if (!cartId || !state) return next(new AppError('invalid id', 404));

        const cart = await cartService.updateState(cartId, state);
        response.status(200).json({
            message: 'success',
            cart
        })
    }


    @Post('/upload/:productId')
    @use(imgConfig)
    @use(uploadMedia)
    @use(authService.restrictTo('seller'))
    @use(authService.protectedRoute)
    public async uploadProductImage(request: requestMedia, response: Response, next: NextFunction) {

        const data = {
            images: request.files.images.map((file: any) => {
                const name = file.originalname.split('.')[0];
                return `product-${request.params.productId}-${name}.jpeg`
            })
        }

        const product = await productService.updateProduct(request.params.productId, data);

        response.status(200).json({
            message: 'Image uploaded',
            product
        });
    }
}