import { createProduct } from "../../services/products.js";

export default async function CreateProductController(req, res) {
    try {
        const product = await createProduct(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
