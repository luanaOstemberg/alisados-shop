import CreateProductController from "../controller/products/createProduct.js";
import DeleteProductController from "../controller/products/deleteProduct.js";
import GetProductController from "../controller/products/getProduct.js";
import GetProductsController from "../controller/products/getProducts.js";
import UpdateProductController from "../controller/products/updateProduct.js";

export default function productsRoutes(app){
    app.use('/product', CreateProductController);
    app.use('/product:id', UpdateProductController);
    app.use('/product:id', DeleteProductController);
    app.use('/product:id', GetProductController);
    app.use('/product/all', GetProductsController);
}