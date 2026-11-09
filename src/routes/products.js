import CreateProductController from "../controller/products/createProduct.js";
import DeleteProductController from "../controller/products/deleteProduct.js";
import GetProductController from "../controller/products/getProduct.js";
import GetProductsController from "../controller/products/getProducts.js";
import UpdateProductController from "../controller/products/updateProduct.js";

export default function productsRoutes(app){
    app.post('/product', CreateProductController);
    app.put('/product:id', UpdateProductController);
    app.delete('/product:id', DeleteProductController);
    app.get('/product:id', GetProductController);
    app.get('/product/all', GetProductsController);
}