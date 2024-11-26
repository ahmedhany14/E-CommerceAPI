import { Response } from 'express';

import { Controller } from "../../../Common/Decorators/controller";
import { validator } from "../../../Common/Decorators/validator";
import { Get, Post } from "../../../Common/Decorators/routes";
import { use } from "../../../Common/Decorators/use";

import { ProductDocument } from '../../Products/entitie/IProucts';
import { productService } from '../../Products/product-service';
import { AuthService } from '../../auth/service/auth-service';

import { requestBody } from '../../../Common/interfaces/auth-types';

const authService = new AuthService();

@Controller('/seller')
class SellerConroller {

    constructor() { }

    @Post('/new')
    @use(authService.protectedRoute)
    @use(authService.restrictTo('seller'))
    @validator('name', 'price', 'description', 'countInStock', 'images', 'category', 'discount')
    public async createProduct(request: requestBody, response: Response): Promise<void> {
        const newProduct = {
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
        } as ProductDocument
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
