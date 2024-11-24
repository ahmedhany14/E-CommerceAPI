import Product from './entitie/product-entitie';
import { ProductEntitie } from './entitie/product-entitie';
import { AppError } from '../../utils/AppError';

class ProductService {
    constructor() { }

    public async createProduct(product: ProductEntitie): Promise<ProductEntitie> {
        const newProduct = await Product.create(product);
        return newProduct as ProductEntitie;
    }


    public async getProduct(id: string): Promise<ProductEntitie> {
        const product = await Product.findById(id).select('-_id -__v');
        if (!product) throw new Error('Product not found');
        return product;
    }
}


export const productService = new ProductService();