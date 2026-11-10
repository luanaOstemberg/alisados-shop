import { getCategories } from "../../services/categories.js";

export default async function GetCategoriesController(req, res) {
    try {
        const categories = await getCategories();
        res.status(200).json(categories);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
