import { registerUser } from "../../services/auth.js";

export default async function RegisterController(req, res) {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ message: `El usuario ${user.name} se registro exitosamente` });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
