import mongoose from "mongoose";

export interface ProfileEntitie {
    name: string;
    photo?: string;
    address?: string;
    number?: string;
    role: string;
    nationalNumber?: string;
    _id?: string;
}

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

const Profile = mongoose.model<ProfileEntitie>('Profile', profileSchema);

export default Profile;

