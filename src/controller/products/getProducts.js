import Products from "../../models/products.js";
import HttpError from "../../helpers/classes/HttpError.js";

export default async function GetProductsController(req, res) {
    try {
        const products = await Products.find()
        if (!products) throw new HttpError(404, 'No hay productos cargados');
        res.status(200).json(products);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}