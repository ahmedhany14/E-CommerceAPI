import mongoose from "mongoose";

export interface IProduct {
    name: string;
    price: number;
    discount: number;
    description: string;
    countInStock: number;
    images: [string];
    category: [string];
    rateCount: number;
    rateAverage: number;
    sellerID: string;
}

export interface ProductDocument extends IProduct, mongoose.Document { }