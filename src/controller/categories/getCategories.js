import Category from "../../models/category.js";
import HttpError from "../../helpers/classes/HttpError.js";

export default async function CreateCategoryController(req, res) {
    try {
        const categories = await Category.find();
        if (!categories) throw new HttpError(404, 'No hay categorias cargadas');
        res.status(200).json(categories);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }

}