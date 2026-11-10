import HttpError from "../../helpers/classes/HttpError.js";
import Products from "../../models/products.js";

export default async function GetProductController(req, res) {
    try {
        const { id } = req.params;
        const product = await Products.findById(id);
        if (!product) throw new HttpError(404, 'No existe este producto.');
        res.status(200).json(product);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}