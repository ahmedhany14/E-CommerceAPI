import jwt from "jsonwebtoken";

export class TokenService {
    private readonly secret: string = process.env.JWT_SECRET as string;
    private readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN as string;
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