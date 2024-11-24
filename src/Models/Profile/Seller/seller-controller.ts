import { Request, Response, NextFunction } from 'express';
import { profileService } from '../profile-servies';

import { Controller } from "../../../Decorators/controller";
import { Get, Post } from "../../../Decorators/routes";
import { validator } from "../../../Decorators/validator";
import { use } from "../../../Decorators/use";
import { AppError } from '../../../utils/AppError';
import { requestBody } from '../../../interfaces/requestBody';
import { AuthService } from '../../auth/service/auth-service';
import { ProductEntitie } from '../../Products/entitie/product-entitie';
import { productService } from '../../Products/product-service';

const authService = new AuthService();

@Controller('/seller')
class SellerConroller {

    constructor() { }

    @Post('/new')
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


    @Get('/products')
    @use(authService.protectedRoute)
    @use(authService.restrictTo('seller'))
    public async getSellerProducts(request: requestBody, response: Response): Promise<void> {
        const products = await productService.getSellerProducts(request.user.id);
        response.status(200).json({
            status: 'success',
            products
        });
    }

    @Post('/update/:productId')
    @use(authService.protectedRoute)
    @use(authService.restrictTo('seller'))
    public async updateProduct(request: requestBody, response: Response): Promise<void> {
        const product = request.body
        const updatedProduct = await productService.updateProduct(request.params.productId, product);
        response.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            updatedProduct
        });
    }
}
