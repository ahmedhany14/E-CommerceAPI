import { CartDocument } from './entitie/ICart';
import Cart from './entitie/cart-entitie'


class CartService {

    constructor() { }

    public async CreateCart(cart: CartDocument): Promise<CartDocument> {
        const newCart = (await (await Cart.create(cart)).populate('productsIDs')).populate('profileID');
        return newCart;
    }

    public async updateState(id: string, state: string): Promise<CartDocument> {
        const cart = await Cart.findByIdAndUpdate(id, { state: state }, { new: true, runValidators: true });
        return cart as CartDocument;
    }

}

const cartService = new CartService();
export default cartService; 