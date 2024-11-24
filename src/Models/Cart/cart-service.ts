import { CartEntitie } from './entitie/cart-entitie'
import Cart from './entitie/cart-entitie'


class CartService {

    constructor() { }

    public async CreateCart(cart: CartEntitie): Promise<CartEntitie> {
        const newCart = (await (await Cart.create(cart)).populate('productsIDs')).populate('profileID');
        return newCart;
    }

}

const cartService = new CartService();
export default cartService; 