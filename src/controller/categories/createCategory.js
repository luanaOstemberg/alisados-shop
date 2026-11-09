import Category from "../../models/category.js";

export default async function CreateCategoryController(req, res) {
    try {
        const { name, description } = req.body;
        await Category.create({ name, description });
        res.status(201).json({ message: 'La categoria fue registrada' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }

}