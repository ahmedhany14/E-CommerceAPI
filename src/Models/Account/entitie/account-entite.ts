import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
export interface AccountEntite extends mongoose.Document {
    email: string;
    password: string;
    confirmPassword: string | undefined;
    passwordChangedTime: Date;
    resetToken: string | undefined;
    expireResetToken: Date | undefined;
    profileID: string;
    comparePassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    changedPasswordAfter(JWTTimestamp: number): boolean;
    createPasswordResetToken(): Promise<string>;
}

const accountSchema: mongoose.Schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    confirmPassword: {
        type: String || undefined,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (this: AccountEntite): boolean {
                return this.password === this.confirmPassword;
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangedTime: Date,
    resetToken: String,
    expireResetToken: Date,
    profileID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    }
});


accountSchema.pre<AccountEntite>('save', async function (next) {
    // middleware to hash password by using bcrypt
    if (!this.isModified('password')) return next();

    this.password = await bcryptjs.hash(this.password, 12);
    this.confirmPassword = undefined;

    next();
});

accountSchema.methods.comparePassword =
    async function (candidatePassword: string, userPassword: string): Promise<boolean> {
        return await bcryptjs.compare(candidatePassword, userPassword);
    }

accountSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
    if (this.passwordChangedTime) {
        const changedTimestamp: number = this.passwordChangedTime.getTime() / 1000;
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

accountSchema.methods.createPasswordResetToken = async function (): Promise<string> {

    const resetToken: string = await crypto.randomBytes(32).toString('hex');
    const hashedToken: string = await crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetToken = hashedToken;
    this.expireResetToken = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    return resetToken;
}

const Account = mongoose.model<AccountEntite>('Account', accountSchema);

export default Account;