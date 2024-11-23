import jwt from "jsonwebtoken";

export class TokenService {
    private readonly secret: string = process.env.JWT_SECRET as string;
    private readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN as string;
    private readonly cookieExpiresIn: number = process.env.COOKIE_EXPIRES_IN as unknown as number;
    private readonly cookieOptions = {
        expires: new Date(Date.now() + this.cookieExpiresIn * 60 * 60 * 1000),
        httpOnly: true
    }
    constructor(
    ) { }

    private signToken(payload: string): string {
        return jwt.sign(
            { payload },
            this.secret,
            { expiresIn: this.JWT_EXPIRES_IN }
        );
    }


    public createToken(payload: string): string {
        const token = this.signToken(payload);
        return token;
    }

}