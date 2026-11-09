import bcrypt from "bcrypt";
import User from "../../models/user.js";
import HttpError from "../../helpers/classes/HttpError.js";
import jwt from "jsonwebtoken";

export default async function LoginController(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new HttpError(401, 'Credenciales inválidas');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new HttpError('Credenciales inválidas');

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_JWT,
            { expiresIn: '2h' }
        );

        res.json({ token, user: { id: user._id, email: user.email } })
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}