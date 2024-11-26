import { Document } from 'mongoose';

export interface IAcount {
    email: string;
    password: string;
    confirmPassword: string | undefined;
    passwordChangedTime: Date;
    resetToken: string | undefined;
    expireResetToken: Date | undefined;
    active: boolean;
    profileID: string;
}

export interface AccountEntiteMethods {
    comparePassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    changedPasswordAfter(JWTTimestamp: number): boolean;
    createPasswordResetToken(): Promise<string>;
}

export interface AccountEntiteDocument extends IAcount, AccountEntiteMethods, Document { }
