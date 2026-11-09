import User from "../../models/user.js";
import HttpError from "../../helpers/classes/HttpError.js";
import HashPassword from '../../helpers/functions/hashPassword.js';

export default async function RegisterController(req, res) {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email: email });
        if (existing) throw new HttpError(401, 'El email ya está en uso.')
        const hashedPassword = await HashPassword(password);
        await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: `El usuario ${name} se registro exitosamente` });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}