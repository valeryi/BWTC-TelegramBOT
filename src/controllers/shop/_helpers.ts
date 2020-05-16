import Keyboard from 'telegraf-keyboard';
import { IProduct } from '../../models/product.model';


export function getProductList(products: IProduct[]) {

    const options = {
        inline: true,
        duplicates: false, 
        newline: false,
    };

    const ProductList = new Keyboard(options);

    products.forEach(product => {
        ProductList.add(`${product.name} ${product.weight}кг - ${product.price / 100}грн:productDetails ${product._id}`);
    })

    return ProductList

}