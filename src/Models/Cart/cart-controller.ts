import { Request, Response, NextFunction, request, response } from "express";

import { Controller } from "../../Common/Decorators/controller";
import { validator } from "../../Common/Decorators/validator";
import { Get, Post } from "../../Common/Decorators/routes";
import { use } from "../../Common/Decorators/use";

import { PaymentServiceFactory } from "../Payments/payment.service.factory";
import { ProductService } from "../Products/product-service";
import { ProfileService } from "../Profile/profile-servies";
import { authService } from "../auth/service/auth-service";
import { CartService } from "./cart-service";


import { requestAuth, requestCart } from "../../Common/interfaces/auth-types";
import { ICart } from "./entitie/ICart";

import { AppError, AuthError, BadRequestError, NotFoundError } from "../../Common/utils/AppError";

@Controller("/cart")
class CartController {

    constructor(
        private cartService: CartService = new CartService(),
        private productService: ProductService = new ProductService(),
        private profileService: ProfileService = new ProfileService(),
        private paymentFactory: PaymentServiceFactory = new PaymentServiceFactory()
    ) { }

    public createHashProductIDs(productIDs: Array<string>): Map<string, number> {
        const hashProductIDs = new Map<string, number>();
        for (let i = 0; i < productIDs.length; i++)
            hashProductIDs.has(productIDs[i]) ? hashProductIDs.set(productIDs[i], (hashProductIDs.get(productIDs[i]) as number) + 1) :
                hashProductIDs.set(productIDs[i], 1);
        return hashProductIDs;
    }

    @Post('/pay')
    @validator('productIDs')
    @use(authService.protectedRoute)
    public async pay(request: requestCart, response: Response, next: NextFunction) {
        const controller = new CartController();

        const { productIDs } = request.body, user = request.user;
        if (!productIDs || typeof productIDs !== 'object') {
            return next(new BadRequestError('Invalid productIDs'));
        }
        if (!user) throw new AuthError('User not found');

        const hashProductIDs = controller.createHashProductIDs(productIDs);

        const products_price = await controller.productService.getProductsPrice(hashProductIDs);

        if (products_price === -1) return next(new NotFoundError('Product not found'));

        request.cart = {
            products: productIDs,
            price: products_price
        };

        const paymentSession = await controller.paymentFactory.getRepository('stripe').createSession(request, response, next);

        response.status(200).json({
            message: 'Payment session created',
            session: paymentSession
        });
    }

    @Get('/cartPayment/cancel')
    public async cancel(request: requestAuth, response: Response, next: NextFunction) {
        response.status(200).json({ message: 'Payment cancelled' });
    }

    @Get('/cartPayment/success')
    public async success(request: requestCart, response: Response, next: NextFunction) {
        const controller = new CartController();

        const { profileId, price, products, method } = request.query;
        if (!profileId || !price || !products) return next(new BadRequestError('Invalid query params'));

        let productsIDs = (products as string).split(',');

        const cart: ICart = {
            buiedAt: new Date(),
            Orderstate: 'pending',
            Orderprice: +price as number,
            paymentMethod: method as string,
            buyerId: profileId as string,
            productsIDs: productsIDs
        }

        const cartDoc = await controller.cartService.addCart(cart);

        if (!cartDoc) return next(new AppError('Cart not created', 500));

        const hashProductIDs = controller.createHashProductIDs(productsIDs);

        let updatedProducts = [];
        for (let [key, value] of hashProductIDs) {
            const product = await controller.productService.updateProductQuantity(key, value);
            updatedProducts.push([product, value]);
        }

        await controller.profileService.addOrder(profileId as string, cartDoc._id as string);

        response.status(200).json({
            message: 'Payment success',
            price: price,
            cart: cartDoc,
            products: updatedProducts,
        });
    }
}
