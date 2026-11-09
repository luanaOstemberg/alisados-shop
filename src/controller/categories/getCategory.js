import Category from "../../models/category.js";
import HttpError from "../../helpers/classes/HttpError.js";

export default async function GetCategoryController(req, res) {
    try {
        const { name } = req.query;
        const category = await Category.findOne({ name });
        if (!category) throw new HttpError(404, 'No existe esa categoria.');
        res.status(200).json(category);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}