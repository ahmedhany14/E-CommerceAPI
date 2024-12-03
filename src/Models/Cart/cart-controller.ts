import {Request, Response, NextFunction} from "express";

import {Controller} from "../../Common/Decorators/controller";
import {validator} from "../../Common/Decorators/validator";
import {Get, Post} from "../../Common/Decorators/routes";
import {use} from "../../Common/Decorators/use";

import {authService} from "../auth/service/auth-service";
import {CartDocument} from "./entitie/ICart";
import cartService from "./cart-service";

import {requestAuth} from "../../Common/interfaces/auth-types";

@Controller("/cart")
class CartController {

    @Post('/pay')
    @validator('productIDs')
    @use(authService.protectedRoute)
    public async pay(req: Request, res: Response, next: NextFunction) {

    }
}


