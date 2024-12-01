import mongoose from "mongoose";

import { ProfileDocument } from './IProfile'

const profileSchema: mongoose.Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    photo: {
        type: String
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

const Profile = mongoose.model<ProfileDocument>('Profile', profileSchema);

export default Profile;

