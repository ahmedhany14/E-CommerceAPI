import mongoose from "mongoose";

export interface ProductEntitie {
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

const ProductSchema: mongoose.Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    discount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    countInStock: {
        type: Number,
        required: [true, 'Please provide a count in stock'],
    },
    images: {
        type: [String],
        required: [true, 'Please provide images'],
    },
    category: {
        type: [String],
        required: [true, 'Please provide a category'],
    },
    rateCount: {
        type: Number,
        default: 0
    },
    rateAverage: {
        type: Number,
        default: 0
    },
    sellerID: {
        type: String,
        required: [true, 'Please provide a seller ID'],
        ref: 'Profile'
    }
});

const Product = mongoose.model<ProductEntitie>('Product', ProductSchema);

export default Product;

