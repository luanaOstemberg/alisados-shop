import Category from "../models/category.js";
import HttpError from "../helpers/classes/HttpError.js";
import mapError from "../helpers/functions/errorMapper.js";

export async function createCategory({ name, description }) {
    try {
        if (!name || !description) {
            throw new HttpError(400, "El nombre y la descripción son requeridos");
        }

        const exists = await Category.findOne({ name });
        if (exists) throw new HttpError(409, "La categoría ya existe");

        return await Category.create({ name, description });
    } catch (err) {
        throw mapError(err, "Error al crear la categoría");
    }
}

export async function getCategories() {
    try {
        const categories = await Category.find();
        if (!categories.length) throw new HttpError(404, "No hay categorías cargadas");
        return categories;
    } catch (err) {
        throw mapError(err, "Error al obtener las categorías");
    }
}

export async function getCategory(name) {
    try {
        if (!name) throw new HttpError(400, "El nombre de la categoría es requerido");

        const category = await Category.findOne({ name });
        if (!category) throw new HttpError(404, "No existe esa categoría");
        return category;
    } catch (err) {
        throw mapError(err, "Error al obtener la categoría");
    }
}

export async function deleteCategory(name) {
    try {
        if (!name) throw new HttpError(400, "El nombre de la categoría es requerido");

        const category = await Category.findOneAndDelete({ name });
        if (!category) throw new HttpError(404, "La categoría no existe");
        return category;
    } catch (err) {
        throw mapError(err, "Error al eliminar la categoría");
    }
}
