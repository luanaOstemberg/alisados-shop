import authRoutes from "./auth.js";
import categoriesRoutes from "./categories.js";
import productsRoutes from "./products.js";

export default function routes({app}){
    authRoutes(app);
    productsRoutes(app);
    categoriesRoutes(app);

}