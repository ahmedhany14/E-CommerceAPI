import mongoose from "mongoose";
import { ProductEntitie } from "./../../Products/entitie/product-entitie"

export interface CartEntitie extends mongoose.Document {
    buiedAy: Date;
    profileID: string;
    productsIDs: Array<ProductEntitie>
}


const cartSchema: mongoose.Schema = new mongoose.Schema({
    buiedAy: {
        type: Date
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