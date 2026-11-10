import { deleteProduct } from "../../services/products.js";

export default async function DeleteProductController(req, res) {
    try {
        await deleteProduct(req.params.id);
        res.status(200).json({ message: "La producto fue eliminado correctamente" });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
