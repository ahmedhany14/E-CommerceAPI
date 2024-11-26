import mongoose from "mongoose";

export interface IFeedback {
    content: string;
    postTime: Date;
    profileID: string;
    productID: string;
}

export interface feedbackDocument extends mongoose.Document, IFeedback { }