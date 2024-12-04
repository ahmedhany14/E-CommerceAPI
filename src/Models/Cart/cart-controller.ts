import {Request, Response, NextFunction, request, response} from "express";

import {Controller} from "../../Common/Decorators/controller";
import {validator} from "../../Common/Decorators/validator";
import {Get, Post} from "../../Common/Decorators/routes";
import {use} from "../../Common/Decorators/use";

import {PaymentServiceFactory} from "../Payments/payment.service.factory";
import {authService} from "../auth/service/auth-service";
import {CartDocument} from "./entitie/ICart";
import cartService from "./cart-service";
import {productService} from "../Products/product-service";

import {ProductDocument} from "./../Products/entitie/IProucts";
import {requestAuth, requestCart} from "../../Common/interfaces/auth-types";

import {AppError, AuthError, BadRequestError, ValidationError, NotFoundError} from "../../Common/utils/AppError";

@Controller("/cart")
class CartController {

    constructor(
    ) {
    }

    @Post('/pay')
    @validator('productIDs')
    @use(authService.protectedRoute)
    public async pay(request: requestCart, response: Response, next: NextFunction) {
        const {productIDs} = request.body;

        const user = request.user;
        if (!productIDs || typeof productIDs !== 'object') {
            return next(new BadRequestError('Invalid productIDs'));
        }
        if (!user) throw new AuthError('User not found');
        const products_price = await productService.getProductsPrice(productIDs);
        if (products_price === -1) {
            return next(new NotFoundError('Product not found'));
        }
        request.cart = {
            products: productIDs,
            price: products_price
        };
        const paymentServiceFactory = new PaymentServiceFactory();
        const paymentService = paymentServiceFactory.getRepository('stripe');
        const payment = await paymentService.createSession(request, response, next);
        response.status(200).json(payment);
    }

    @Get('/cartPayment/cancel')
    public async cancel(request: requestAuth, response: Response, next: NextFunction) {
        response.status(200).json({message: 'Payment cancelled'});
    }

    @Get('/cartPayment/success')
    public async success(request: requestAuth, response: Response, next: NextFunction) {
        response.status(200).json({message: 'Payment success'});
    }
}
