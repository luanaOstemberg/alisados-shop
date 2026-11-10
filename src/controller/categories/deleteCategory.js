import Category from "../../models/category.js";
import HttpError from "../../helpers/classes/HttpError.js";

export default async function CreateCategoryController(req, res) {
    try {
        const { name } = req.params;
        const category = await Category.findOneAndDelete({ name });
        if (!category) throw new HttpError(404, 'La categoría no existe');
        res.status(201).json({ message: 'La categoria fue eliminada correctamente' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }

}