import CreateCategoryController from "../controller/categories/createCategory.js";
import DeleteCategoryController from "../controller/categories/deleteCategory.js";
import GetCategoriesController from "../controller/categories/getCategories.js";
import GetCategoryController from "../controller/categories/getCategory.js";

export default function categoriesRoutes(app){
    app.use('/categories', CreateCategoryController);
    app.use('/categories:id', DeleteCategoryController);
    app.use('/categories/all', GetCategoriesController);
    app.use('/categories:id', GetCategoryController);
}