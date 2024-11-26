
import Product from './entitie/product-entitie';
import { ProductDocument } from './entitie/IProucts';

import { AppError } from '../../Common/utils/AppError';

class ProductService {
    constructor() { }

    public async createProduct(product: ProductDocument): Promise<ProductDocument> {
        const newProduct = await Product.create(product);
        return newProduct as ProductDocument;
    }

    public async getProducts(category: string): Promise<ProductDocument[]> {
        const products = await Product.find({
            category: { $all: [category] }
        })
        return products;
    }

    public async getProduct(id: string): Promise<ProductDocument> {
        const product = await Product.findById(id).select('-_id -__v');
        if (!product) throw new Error('Product not found');
        return product;
    }

    public async getSellerProducts(sellerId: string): Promise<ProductDocument[]> {
        const products = await Product.find({
            sellerID: sellerId
        });
        return products;
    }

    public async updateProduct(id: string, product: any): Promise<ProductDocument> {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        if (!updatedProduct) throw new AppError('Product not found', 404);
        return updatedProduct;
    }

    public async getProductsPrice(productsIds: string[]): Promise<number> {
        let price = 0;
        try {
            for (let i = 0; i < productsIds.length; i++) {
                const product = await Product.findById(productsIds[i]);
                if (!product) throw new AppError('Product not found', 404);
                price += product.price;
            }
        } catch (err) {
            console.log(err);
            return -1;
        }
        return price;
    }
}
export const productService = new ProductService();