import mongoose from 'mongoose';

export interface IBookMark {
    profileId: mongoose.Types.ObjectId;
    productId: Array<mongoose.Types.ObjectId>;
}


export interface IBookMarkDocument extends mongoose.Document, IBookMark { }