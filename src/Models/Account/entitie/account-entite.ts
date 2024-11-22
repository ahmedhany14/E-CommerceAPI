import mongoose from "mongoose";

export interface AccountEntite extends mongoose.Document {
    email: string;
    password: string;
    confirmPassword: string;
    passwordChangedTime: Date;
    resetToken: string;
    expireResetToken: Date;
    profileID: string;
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
        type: String,
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

const Account = mongoose.model<AccountEntite>('Account', accountSchema);

export default Account;