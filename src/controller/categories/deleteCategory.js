import { deleteCategory } from "../../services/categories.js";

export default async function DeleteCategoryController(req, res) {
    try {
        await deleteCategory(req.params.name);
        res.status(200).json({ message: "La categoría fue eliminada correctamente" });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
