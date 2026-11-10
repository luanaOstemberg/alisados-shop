import { loginUser } from "../../services/auth.js";

export default async function LoginController(req, res) {
    try {
        const result = await loginUser(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
