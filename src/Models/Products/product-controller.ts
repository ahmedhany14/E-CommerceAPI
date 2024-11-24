import { Request, Response, NextFunction } from 'express';

import { Get, Post } from './../../Decorators/routes'
import { Controller } from '../../Decorators/controller';
import { validator } from '../../Decorators/validator';
import { use } from '../../Decorators/use';

import { authService } from '../auth/service/auth-service';
import { ProductEntitie } from './entitie/product-entitie';
import { productService } from './product-service';
import { profileService } from "./../Profile/profile-servies"
import cartService from './../Cart/cart-service'
import { CartEntitie } from './../Cart/entitie/cart-entitie';

import { requestBody } from './../../interfaces/requestBody';
import { AppError } from '../../utils/AppError';

@Controller('/products')
class ProductController {
    constructor() { }

    @Post('/')
    @use(authService.protectedRoute)
    @use(authService.restrictTo('seller'))
    @validator('name', 'price', 'description', 'countInStock', 'images', 'category', 'discount')
    public async createProduct(request: requestBody, response: Response): Promise<void> {
        const newProduct: ProductEntitie = {
            name: request.body.name,
            price: request.body.price,
            discount: request.body.discount,
            description: request.body.description,
            countInStock: request.body.countInStock,
            images: request.body.images,
            category: request.body.category,
            rateCount: 0,
            rateAverage: 0,
            sellerID: request.user.id
        }
        await productService.createProduct(newProduct);

        response.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            newProduct
        });
    }

    @Get('/buy/:productId')
    @validator('productsIds')
    @use(authService.protectedRoute)
    public async buyProduct(request: requestBody, response: Response, next: NextFunction) {
        /*
        logic here
        1) profile id
        2) product id from the parameter
        3) add this product to user cart 
        */
        const profileId = request.user.profileID, productsIds = request.body.productsIds;
        console.log(request.body)
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