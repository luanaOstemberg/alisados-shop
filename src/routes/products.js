import CreateProductController from "../controller/products/createProduct.js";
import DeleteProductController from "../controller/products/deleteProduct.js";
import GetProductController from "../controller/products/getProduct.js";
import GetProductsController from "../controller/products/getProducts.js";
import UpdateProductController from "../controller/products/updateProduct.js";
import Auth from "../middleware/auth.js";

export default function productsRoutes(app) {
    app.post('/product', Auth, CreateProductController);
    app.put('/product/:id', Auth, UpdateProductController);
    app.delete('/product/:id', Auth, DeleteProductController);
    app.get('/product/all', Auth, GetProductsController);
    app.get('/product/:id', Auth, GetProductController);
}