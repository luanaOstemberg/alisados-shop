import HttpError from "../../helpers/classes/HttpError.js";
import Category from "../../models/category.js";
import Products from "../../models/products.js";

export default async function DeleteProductController(req, res) {
    try {
        const { id } = req.params;
        const product = await Products.findByIdAndDelete(id);
        if (!product) throw new HttpError(404, 'El producto no existe');

        if (product.category) {
            await Category.updateOne({ _id: product.category }, { $inc: { productCount: -1 } });
        }

        res.status(201).json({ message: 'La producto fue eliminado correctamente' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}