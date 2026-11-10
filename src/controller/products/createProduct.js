import HttpError from "../../helpers/classes/HttpError.js";
import Category from "../../models/category.js";
import Products from "../../models/products.js";

export default async function CreateProductController(req, res) {
    try {
        const { name, description, price, stock, category: categoryName } = req.body;
        const category = await Category.findOne({ name: categoryName });
        if (!category) throw new HttpError(404, `La categoría "${categoryName}" no existe.`);

        const product = await Products.create({
            name,
            description,
            price,
            stock,
            category: category._id,
        });

        await Category.updateOne({ _id: category._id }, { $inc: { productCount: 1 } });

        res.status(201).json(product);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}