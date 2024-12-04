
import Product from './entitie/product-entitie';
import { ProductDocument } from './entitie/IProucts';

import { AppError } from '../../Common/utils/AppError';

export class ProductService {
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

    public async getProductsPrice(productsIds: Map<string, number>): Promise<number> {
        let price = 0;
        try {
            for (let [key, value] of productsIds) {
                const product = await Product.findById(key);
                if (!product) throw new AppError('Product not found', 404);
                if (product.countInStock < value) throw new AppError('Product out of stock', 404);
                price += product.price * value - (product.price * value * product.discount / 100);
            }
        } catch (err) {
            console.log(err);
            return -1;
        }
        return price;
    }

    public async updateProductQuantity(id: string, decrease: number): Promise<ProductDocument> {
        const product = await Product.findOneAndUpdate({ _id: id }, { $inc: { countInStock: -decrease } }, { new: true }) as ProductDocument;
        return product;
    }
}
export const productService = new ProductService();