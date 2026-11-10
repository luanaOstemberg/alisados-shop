import { getCategory } from "../../services/categories.js";

export default async function GetCategoryController(req, res) {
    try {
        const category = await getCategory(req.params.name);
        res.status(200).json(category);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
