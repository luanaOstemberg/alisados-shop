import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HashPassword from "../helpers/functions/hashPassword.js";
import HttpError from "../helpers/classes/HttpError.js";
import mapError from "../helpers/functions/errorMapper.js";

export async function registerUser({ name, email, password }) {
    try {
        if (!name || !email || !password) {
            throw new HttpError(400, "Nombre, email y contraseña son requeridos");
        }

        const exists = await User.findOne({ email });
        if (exists) throw new HttpError(409, "El email ya está en uso.");

        const hashedPassword = await HashPassword(password);
        return await User.create({ name, email, password: hashedPassword });
    } catch (err) {
        throw mapError(err, "Error al registrar el usuario");
    }
}

export async function loginUser({ email, password }) {
    try {
        if (!email || !password) {
            throw new HttpError(400, "Email y contraseña son requeridos");
        }

        const user = await User.findOne({ email });
        if (!user) throw new HttpError(401, "Credenciales inválidas");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new HttpError(401, "Credenciales inválidas");

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_JWT,
            { expiresIn: "2h" }
        );

        return { token, user: { id: user._id, email: user.email } };
    } catch (err) {
        throw mapError(err, "Error al iniciar sesión");
    }
}
