import jwt from "jsonwebtoken";

import { TokenService } from "./token-service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../utils/AppError";
import { AccountService } from "../../Account/account-service";
import { profileService } from "../../Profile/profile-servies";

export class AuthService {

    private tokenService = new TokenService();
    private accountService = new AccountService();

    private readonly cookieExpiresIn: number = process.env.COOKIE_EXPIRES_IN as unknown as number;
    private readonly cookieOptions = {
        expires: new Date(Date.now() + this.cookieExpiresIn * 60 * 60 * 1000),
        httpOnly: true
    }

    constructor(

    ) { }

    public async createToken(payload: string, response: Response): Promise<string> {
        const token = this.tokenService.createToken(payload);

        response.cookie('jwt', token, this.cookieOptions);
        return token;
    }

    public async protectedRoute(request: Request, response: Response, next: NextFunction) {
        let token: string = '';
        // 1) Getting token from the request
        if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) token = request.headers.authorization.split(' ')[1];
        else if (request.cookies.jwt) token = request.cookies.jwt;
        else next(new AppError('You are not logged in! Please log in to get access.', 401));

        // 2) Verifying the token by using secret key
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        // 3) Check if the account still exists
        const account = await this.accountService.findAccountById(decoded.id);
        if (!account) return next(new AppError('Account not found', 404));
        const profile = await profileService.findProfileById(account.profileID);

        // 4) Check if account changed password after the token was issued
        if (account.changedPasswordAfter(decoded.iat)) return next(new AppError('Password has been changed. Please login again', 401));

        // 5) Grant access to protected route
        request.user = {
            id: account._id,
            email: account.email,
            role: profile.role
        }
        next();
    }
}