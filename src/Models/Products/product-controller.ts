import { Request, Response, NextFunction } from 'express';

import { Get, Post } from './../../Decorators/routes'
import { Controller } from '../../Decorators/controller';
import { validator } from '../../Decorators/validator';
import { use } from '../../Decorators/use';

import { authService } from '../auth/service/auth-service';
import { productService } from './product-service';
import cartService from './../Cart/cart-service'
import { CartEntitie } from './../Cart/entitie/cart-entitie';
import feedbackService from './../FeedBacks/feedback-service'

import { requestBody } from './../../interfaces/requestBody';
import { AppError } from '../../utils/AppError';

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

        const order: CartEntitie = {
            buiedAy: new Date(),
            profileID: profileId,
            productsIDs: productsIds
        }

        const cart = await cartService.CreateCart(order);

        response.status(200).json({
            message: "success",
            cart
        })
    }
}