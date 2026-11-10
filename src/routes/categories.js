import CreateCategoryController from "../controller/categories/createCategory.js";
import DeleteCategoryController from "../controller/categories/deleteCategory.js";
import GetCategoriesController from "../controller/categories/getCategories.js";
import GetCategoryController from "../controller/categories/getCategory.js";
import Auth from "../middleware/auth.js";

export default function categoriesRoutes(app) {
    app.post('/categories', Auth, CreateCategoryController);
    app.delete('/categories/:name', Auth, DeleteCategoryController);
    app.get('/categories/all', Auth, GetCategoriesController);
    app.get('/categories/:name', Auth, GetCategoryController);
}