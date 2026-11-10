import HttpError from "../classes/HttpError.js";

export default function mapError(err, fallbackMessage = "Error interno del servidor") {
    if (err instanceof HttpError) return err;
    if (err.name === "ValidationError") return new HttpError(400, err.message);
    if (err.name === "CastError") return new HttpError(400, "El id ingresado no es válido");
    if (err.code === 11000) return new HttpError(409, "El registro ya existe");
    return new HttpError(500, fallbackMessage);
}
