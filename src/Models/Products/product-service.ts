import Product from './entitie/product-entitie';
import { ProductEntitie } from './entitie/product-entitie';

class ProductService {
    constructor() { }

    public async createProduct(product: ProductEntitie): Promise<ProductEntitie> {
        const newProduct = await Product.create(product);
        return newProduct as ProductEntitie;
    }

}


