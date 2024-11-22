import mongoose from "mongoose";

export interface ProfileEntitie extends mongoose.Document {
    name: string;
    photo: string;
    address: string;
    number: string;
    role: string;
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
        default: 'user'
    }
});

const Profile = mongoose.model<ProfileEntitie>('Profile', profileSchema);

export default Profile;

