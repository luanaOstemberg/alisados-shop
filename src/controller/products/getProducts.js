import { getProducts } from "../../services/products.js";

export default async function GetProductsController(req, res) {
    try {
        const products = await getProducts();
        res.status(200).json(products);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
