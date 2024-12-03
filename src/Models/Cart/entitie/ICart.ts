import mongoose from "mongoose";

export interface ICart {
    buiedAt: Date;
    Orderstate: string;
    Orderprice: number;
    paymentMethod: string;
    buyerId: string;
    productsIDs: Array<string>;
}

export interface CartDocument extends mongoose.Document, ICart { };