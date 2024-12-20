import mongoose from "mongoose";

import { constructMethodsAndMiddlewares } from "./account-actions";
import { AccountEntiteDocument } from "./IAccount";

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
            validator: function (this: AccountEntiteDocument): boolean {
                return this.password === this.confirmPassword;
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangedTime: Date,
    resetToken: String,
    expireResetToken: Date,
    nationalId: String,
    role: {
        type: String,
        enum: ['seller', 'user'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true,
    },
    profileID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    }
});

accountSchema.index({ email: 1 });
accountSchema.index({ expireResetToken: 1, resetToken: 1 });
constructMethodsAndMiddlewares(accountSchema);
const Account = mongoose.model<AccountEntiteDocument>('Account', accountSchema);

export default Account;