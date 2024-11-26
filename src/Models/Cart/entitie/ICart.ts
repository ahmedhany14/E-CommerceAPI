import mongoose from "mongoose";

export interface ICart {
    buiedAy: Date;
    state: string;
    price: number;
    profileID: string;
    productsIDs: Array<string>;
}

export interface CartDocument extends mongoose.Document, ICart { };