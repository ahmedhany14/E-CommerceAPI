import mongoose from "mongoose";

export interface IProfile {
    name: string;
    address?: string;
    phone?: string;
    photo?: string;
    bookmarks?: [string]; // for buyer to store his bookmarks
    orders?: [string]; // for buyer to store his orders
    products?: [string]; // for seller to store his released products
}

export interface ProfileDocument extends IProfile, mongoose.Document { }