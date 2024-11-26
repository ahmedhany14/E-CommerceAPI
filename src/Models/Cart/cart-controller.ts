import {Request, Response, NextFunction} from "express";

import {Controller} from "../../Common/Decorators/controller";
import {validator} from "../../Common/Decorators/validator";
import {Get, Post} from "../../Common/Decorators/routes";
import {use} from "../../Common/Decorators/use";

import {authService} from "../auth/service/auth-service";
import {CartDocument} from "./entitie/ICart";
import cartService from "./cart-service";

import {requestBody} from "../../Common/interfaces/auth-types";

@Controller("/cart")
class CartController {

    @Get("/orders/:state")
    @use(authService.protectedRoute)
    public async getCart(request: requestBody, response: Response, next: NextFunction) {
        const state = request.params.state;
        const profileID = request.user.profileID;
        const Orders = await cartService.getCart(profileID, state) as CartDocument[];

        response.status(200).json({
            status: 'success',
            data: {
                Orders
            }
        })
    }

    /*@Get("/clients-orders/:state")
    @use(authService.restrictTo('seller'))
    @use(authService.protectedRoute)
    */
    public async getClientsOrderds(request: requestBody, response: Response, next: NextFunction) {
        /*
            feature not implemented yet
         */
    }
}

