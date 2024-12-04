import { CartDocument, ICart } from './entitie/ICart';
import Cart from './entitie/cart-entitie'


export class CartService {

    constructor() { }

    public async CreateCart(cart: CartDocument): Promise<CartDocument> {
        const newCart = (await (await Cart.create(cart)).populate('productsIDs')).populate('profileID');
        return newCart;
    }

    public async updateState(id: string, state: string): Promise<CartDocument> {
        const cart = await Cart.findByIdAndUpdate(id, { state: state }, { new: true, runValidators: true });
        return cart as CartDocument;
    }

    public async getCart(profileId: string, state: string): Promise<CartDocument[]> {
        const cart = await Cart.find({
            profileID: profileId,
            state: state
        }).populate('productsIDs');
        return cart as CartDocument[];
    }

    public async addCart(cart: ICart): Promise<CartDocument> {
        const newCart = await (new Cart(cart)).save();
        return newCart;
    }
}

const cartService = new CartService();
export default cartService; 