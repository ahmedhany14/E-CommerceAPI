import {NextFunction, Response} from "express";
import stripe from './../../../Common/configrations/stripe.conf';

import {requestCart} from "../../../Common/interfaces/auth-types";
import {IPayment} from "../interface/IPayment";

export  class PaymentStripeService implements IPayment {

    public async createSession(request: requestCart, response: Response, next: NextFunction) {
        const productIds:string = request.cart.products.join(',');
        const direct_url = `${request.protocol}://${request.get('host')}/ecommerce/cart/cartPayment/success/?profileId=${request.user.profileID}&price=${request.cart.price}&products=${productIds}&method=stripe`;
        const cancel_url = `${request.protocol}://${request.get('host')}/ecommerce/cart/cartPayment/cancel`;
        const user = request.user;
        if (!user) {
            return next()
        }

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                success_url: direct_url,
                cancel_url: cancel_url,
                customer_email: user.email,
                client_reference_id: user.profileID.toString(),
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: "Ecommerce Cart Payment",
                        },
                        unit_amount: request.cart.price * 100,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
            })
            return session;

        }
        catch (error) {
            throw new Error('Payment failed');
        }
    }
}