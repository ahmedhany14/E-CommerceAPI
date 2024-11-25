import { Request, Response, NextFunction } from 'express';

import Account from './entitie/account-entite';
import { AccountEntite } from './entitie/account-entite';
export class AccountService {

    async OauthAccount(email: string, profileID: string) {
        const account = await new Account({ email, profileID }).save({
            validateBeforeSave: false,
        });
        return account;
    }

    async createAccount(email: string, password: string, confirmPassword: string, next: NextFunction): Promise<AccountEntite | void> {
        try {
            const account = await Account.create({ email, password, confirmPassword });
            return account;
        }
        catch (error) {
            return next(error);
        }
    }

    async findAccountByEmail(email: string, isActive: boolean = true): Promise<AccountEntite | null> {
        const account: AccountEntite | null = await Account.findOne({
            email,
            active: isActive
        });

        return account;
    }

    async findAccountById(id: string, isActive: boolean = true): Promise<AccountEntite | null> {
        const account: AccountEntite | null = await Account.findOne({
            _id: id,
            active: isActive
        }).select('-password');

        return account;
    }


    async findAccountByToken(token: string): Promise<AccountEntite | null> {
        const account: AccountEntite | null = await Account.findOne({
            resetToken: token,
            expireResetToken: { $gt: Date.now() }
        });
        return account;
    }

    async deactiveAccount(id: string): Promise<void> {
        await Account.findByIdAndUpdate(id, { active: false });
    }
}
export const accountService = new AccountService();