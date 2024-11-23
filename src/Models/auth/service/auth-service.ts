import { TokenService } from "./token-service";
import { Response } from "express";

export class AuthService {

    private tokenService = new TokenService();
    private readonly cookieExpiresIn: number = process.env.COOKIE_EXPIRES_IN as unknown as number;
    private readonly cookieOptions = {
        expires: new Date(Date.now() + this.cookieExpiresIn * 60 * 60 * 1000),
        httpOnly: true
    }

    constructor(

    ) { }

    public async createToken(payload: string, response:Response): Promise<string> {
        const token = this.tokenService.createToken(payload);

        response.cookie('jwt', token, this.cookieOptions);
        return token;
    }
}