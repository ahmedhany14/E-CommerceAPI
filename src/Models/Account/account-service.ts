import Account from './entitie/account-entite';
import { AccountEntite } from './entitie/account-entite';

export class AccountService {
    async createAccount(email: string, password: string, confirmPassword: string) {
        const account = await Account.create({ email, password, confirmPassword });
        return account;
    }

    async findAccountByEmail(email: string): Promise<AccountEntite | null> {
        const account: AccountEntite | null = await Account.findOne({
            email
        });

        return account;
    }
}