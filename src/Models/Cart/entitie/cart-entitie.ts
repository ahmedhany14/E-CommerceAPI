import mongoose from "mongoose";
import { CartDocument } from "./ICart";


const cartSchema: mongoose.Schema = new mongoose.Schema({
    buiedAy: {
        type: Date
    },
    state: {
        type: String,
        default: 'pending',
        enum: ['pending', 'in a way', 'completed']
    },
    price: {
        type: Number
    },
    profileID: {
        type: String,
        ref: 'Profile'
    },
    productsIDs: [{
        type: String,
        ref: 'Product'
    }]
})

const Cart = mongoose.model<CartDocument>('Cart', cartSchema);

export default Cart;