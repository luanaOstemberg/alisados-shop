import { createCategory } from "../../services/categories.js";

export default async function CreateCategoryController(req, res) {
    try {
        const category = await createCategory(req.body);
        res.status(201).json({ message: "La categoría fue registrada", category });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
