import Product from './entitie/product-entitie';
import { ProductEntitie } from './entitie/product-entitie';
import { AppError } from '../../utils/AppError';

class ProductService {
    constructor() { }

    public async createProduct(product: ProductEntitie): Promise<ProductEntitie> {
        const newProduct = await Product.create(product);
        return newProduct as ProductEntitie;
    }

    public async getProducts(category: string): Promise<ProductEntitie[]> {
        const products = await Product.find({
            category: { $all: [category] }
        })
        return products;
    }

    public async getProduct(id: string): Promise<ProductEntitie> {
        const product = await Product.findById(id).select('-_id -__v');
        if (!product) throw new Error('Product not found');
        return product;
    }

    public async getSellerProducts(sellerId: string): Promise<ProductEntitie[]> {
        const products = await Product.find({
            sellerID: sellerId
        });
        return products;
    }

    public async updateProduct(id: string, product: any): Promise<ProductEntitie> {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        if (!updatedProduct) throw new AppError('Product not found', 404);
        return updatedProduct;
    }
}
export const productService = new ProductService();