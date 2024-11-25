import mongoose from "mongoose";
import { ProductEntitie } from "./../../Products/entitie/product-entitie"

export interface CartEntitie {
    buiedAy: Date;
    state: string;
    profileID: string;
    productsIDs: Array<string>;
}


const cartSchema: mongoose.Schema = new mongoose.Schema({
    buiedAy: {
        type: Date
    },
    state: {
        type: String,
        default: 'pending',
        enum: ['pending', 'in a way', 'completed']
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

const Cart = mongoose.model<CartEntitie>('Cart', cartSchema);

export default Cart;