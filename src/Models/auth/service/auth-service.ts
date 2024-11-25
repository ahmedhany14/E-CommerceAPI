import jwt from "jsonwebtoken";

import { TokenService } from "./token-service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../utils/AppError";
import { AccountService } from "../../Account/account-service";
import { profileService } from "../../Profile/profile-servies";
import { requestBody } from "../../../interfaces/requestBody";

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

    public async protectedRoute(request: requestBody, response: Response, next: NextFunction) {
        if (!request.headers.cookie || request.headers.cookie == 'jwt=loggedout')
            return next(new AppError('You are not logged in! Please log in to get access.', 401));

        // 1) Getting token from the cookie
        let token: string = request.headers.cookie.split('=')[1];

        // 2) Verifying the token by using secret key
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        // 3) Check if the account still exists
        const account = await accountService.findAccountById(decoded.payload);
        console.log(account);
        if (!account) return next(new AppError('Account not found', 404));
        const profile = await profileService.findProfileById(account.profileID);

        // 4) Check if account changed password after the token was issued
        if (account.changedPasswordAfter(decoded.iat)) return next(new AppError('Password has been changed. Please login again', 401));

        // 5) Grant access to protected route
        request.user = {
            id: account._id as string,
            profileID: account.profileID,
            email: account.email,
            role: profile.role
        }
        next();
    }

    public restrictTo(...roles: string[]) {

        return async (request: requestBody, response: Response, next: NextFunction) => {
            if (!request.headers.cookie) return next(new AppError('You need to log in', 403));
            const decoded: any = jwt.verify(request.headers.cookie.split('=')[1], process.env.JWT_SECRET as string);
            const account = await accountService.findAccountById(decoded.payload);
            const profile = await profileService.findProfileById(account?.profileID as string);
            if (!roles.includes(profile.role)) return next(new AppError('You do not have permission to perform this action', 403));
            next();
        }
    }

}

export const authService = new AuthService();