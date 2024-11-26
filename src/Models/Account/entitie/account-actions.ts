import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { AccountEntiteDocument } from "./IAccount";


export function constructMethodsAndMiddlewares(Schema: mongoose.Schema): void {
    Schema.pre<AccountEntiteDocument>('save', async function (next) {
        // middleware to hash password by using bcrypt
        if (!this.isModified('password')) return next();

        this.password = await bcryptjs.hash(this.password, 12);
        this.confirmPassword = undefined;

        next();
    });

    Schema.methods.comparePassword =
        async function (candidatePassword: string, userPassword: string): Promise<boolean> {
            return await bcryptjs.compare(candidatePassword, userPassword);
        }

    Schema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
        if (this.passwordChangedTime) {
            const changedTimestamp: number = this.passwordChangedTime.getTime() / 1000;
            return JWTTimestamp < changedTimestamp;
        }
        return false;
    }

    Schema.methods.createPasswordResetToken = async function (): Promise<string> {

        const resetToken: string = await crypto.randomBytes(32).toString('hex');
        const hashedToken: string = await crypto.createHash('sha256').update(resetToken).digest('hex');

        this.resetToken = hashedToken;
        this.expireResetToken = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        return resetToken;
    }
}