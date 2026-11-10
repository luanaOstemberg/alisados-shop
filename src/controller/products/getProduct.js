import { getProduct } from "../../services/products.js";

export default async function GetProductController(req, res) {
    try {
        const product = await getProduct(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
