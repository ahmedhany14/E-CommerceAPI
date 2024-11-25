import { CartEntitie } from './entitie/cart-entitie'
import Cart from './entitie/cart-entitie'


class CartService {

    constructor() { }

    public async CreateCart(cart: CartEntitie): Promise<CartEntitie> {
        const newCart = (await (await Cart.create(cart)).populate('productsIDs')).populate('profileID');
        return newCart;
    }

    public async updateState(id: string, state: string): Promise<CartEntitie> {
        const cart = await Cart.findByIdAndUpdate(id, { state: state }, { new: true, runValidators: true });
        return cart as CartEntitie;
    }

}

const cartService = new CartService();
export default cartService; 