import mongoose from "mongoose";
import {CartDocument} from "./ICart";

/*
    buiedAt: Date;
    Orderstate: string;
    Orderprice: number;
    paymentMethod: string;
    buyerId: string;
    productsIDs: Array<string>;

 */
const cartSchema: mongoose.Schema = new mongoose.Schema({
    buiedAt: {
        type: Date,
        required: true
    },
    Orderstate: {
        type: String,
        required: true,
        enum: ['pending', 'inWay', 'completed', 'canceled']
    },
    Orderprice: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile',
    },
    productsIDs: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'Products'
    }
})

cartSchema.index({buyerId: 1, Orderstate: 1});
cartSchema.index({paymentMethod: 1})
const Cart = mongoose.model<CartDocument>('Cart', cartSchema);

export default Cart;