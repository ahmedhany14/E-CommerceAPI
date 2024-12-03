import { Document } from 'mongoose';

export interface IAcount {
    email: string;
    password: string;
    confirmPassword?: string;
    passwordChangedTime?: Date;
    resetToken?: string;
    expireResetToken?: Date;
    nationaId?: string;
    role: string;
    active: boolean;
    profileID: string;
}

export interface AccountEntiteMethods {
    comparePassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    changedPasswordAfter(JWTTimestamp: number): boolean;
    createPasswordResetToken(): Promise<string>;
}

export interface AccountEntiteDocument extends IAcount, AccountEntiteMethods, Document { }
