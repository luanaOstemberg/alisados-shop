import mongoose from "mongoose";
import Products from "../../models/products.js";
import Category from "../../models/category.js";
import HttpError from "../../helpers/classes/HttpError.js";

export default async function UpdateProductController(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpError(400, 'El id ingresado no es válido');

        const previous = await Products.findById(id);
        if (!previous) throw new HttpError(404, 'El producto no existe');

        const body = req.body;
        const data = {};
        for (const field of ['name', 'description', 'price', 'stock', 'category']) {
            if (body[field] !== undefined) data[field] = body[field];
        }

        const product = await Products.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        const categoryChanged = data.category !== undefined &&
            String(previous.category) !== String(product.category);

        if (categoryChanged) {
            if (previous.category) {
                await Category.updateOne({ _id: previous.category }, { $inc: { productCount: -1 } });
            }
            if (product.category) {
                await Category.updateOne({ _id: product.category }, { $inc: { productCount: 1 } });
            }
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
