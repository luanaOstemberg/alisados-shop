import { updateProduct } from "../../services/products.js";

export default async function UpdateProductController(req, res) {
    try {
        const product = await updateProduct(req.params.id, req.body);
        res.status(200).json(product);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
