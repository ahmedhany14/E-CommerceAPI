import mongoose from "mongoose";

export interface IProfile {
    name: string;
    photo?: string;
    address?: string;
    number?: string;
    role: string;
    nationalNumber?: string;
}

export interface ProfileDocument extends IProfile, mongoose.Document { }