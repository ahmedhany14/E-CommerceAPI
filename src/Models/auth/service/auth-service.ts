import jwt from "jsonwebtoken";

import { TokenService } from "./token-service";
import { Response, NextFunction } from "express";
import { AppError, NotFoundError, AuthError} from "../../../Common/utils/AppError";
import { AccountService } from "../../Account/account-service";

import { requestAuth } from "../../../Common/interfaces/auth-types";

const tokenService = new TokenService();
const accountService = new AccountService();

export class AuthService {


    private readonly cookieExpiresIn: number = process.env.COOKIE_EXPIRES_IN as unknown as number;
    private readonly cookieOptions = {
        expires: new Date(Date.now() + this.cookieExpiresIn * 60 * 60 * 1000),
        httpOnly: true
    }

    constructor(

    ) { }

    public async createToken(payload: string, response: Response): Promise<string> {
        const token = tokenService.createToken(payload);

        response.cookie('jwt', token, this.cookieOptions);
        return token;
    }

    public async protectedRoute(request: requestAuth, response: Response, next: NextFunction) {
        if (!request.headers.cookie || request.headers.cookie == 'jwt=loggedout'){
            return next(new AuthError('You need to log in', 403));
        }
            

        // 1) Getting token from the cookie
        let token: string = request.headers.cookie.split('=')[1];

        // 2) Verifying the token by using secret key
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        // 3) Check if the account still exists
        const account = await accountService.findAccountById(decoded.payload);

        if (!account) {
            return next(new NotFoundError('The account belonging to this token does no longer exist', 401));
        }

        // 4) Check if account changed password after the token was issued
        if (account.changedPasswordAfter(decoded.iat)) {
            return next(new AuthError('User recently changed password! Please log in again', 401));
        }

        // 5) Grant access to protected route
        request.user = {
            id: account._id as string,
            profileID: account.profileID,
            email: account.email,
            role: account.role
        }

        next();
    }

    public restrictTo(...roles: string[]) {
        return async (request: requestAuth, response: Response, next: NextFunction) => {

            if (!roles.includes(request.user.role)) return next(new AppError('You do not have permission to perform this action', 403));

            next();
        }
    }

}

export const authService = new AuthService();