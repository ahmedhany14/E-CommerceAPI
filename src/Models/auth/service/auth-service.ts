import { TokenService } from "./token-service";


export class AuthService {

    private tokenService = new TokenService();
    constructor(

    ) { }

    public async createToken(payload: string): Promise<string> {
        const token = this.tokenService.createToken(payload);
        return token;
    }
}