import mongoose from "mongoose";

import { ProfileDocument } from './IProfile'

const profileSchema: mongoose.Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        lowercase: true
    },
    photo: {
        type: String,
    },
    address: {
        type: String,
        lowercase: true
    },
    number: {
        type: String,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'seller']
    },
    nationalNumber: {
        type: String,
        unique: true,
    }
});

const Profile = mongoose.model<ProfileDocument>('Profile', profileSchema);

export default Profile;

