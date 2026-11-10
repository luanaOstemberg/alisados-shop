import mongoose from "mongoose";
import Products from "../models/products.js";
import Category from "../models/category.js";
import HttpError from "../helpers/classes/HttpError.js";
import mapError from "../helpers/functions/errorMapper.js";

function validateId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpError(400, "El id ingresado no es válido");
    }
}

async function resolveCategory(value) {
    if (!value) return null;
    if (mongoose.Types.ObjectId.isValid(value)) {
        return Category.findById(value);
    }
    return Category.findOne({ name: value });
}

export async function createProduct({ name, description, price, stock, category: categoryInput }) {
    try {
        if (!name || !description || price === undefined || stock === undefined || !categoryInput) {
            throw new HttpError(400, "Nombre, descripción, precio, stock y categoría son requeridos");
        }

        const category = await resolveCategory(categoryInput);
        if (!category) throw new HttpError(404, `La categoría "${categoryInput}" no existe`);

        const product = await Products.create({
            name,
            description,
            price,
            stock,
            category: category._id
        });

        await Category.updateOne({ _id: category._id }, { $inc: { productCount: 1 } });
        await product.populate("category");

        return product;
    } catch (err) {
        throw mapError(err, "Error al crear el producto");
    }
}

export async function getProducts() {
    try {
        const products = await Products.find().populate("category");
        if (!products.length) throw new HttpError(404, "No hay productos cargados");
        return products;
    } catch (err) {
        throw mapError(err, "Error al obtener los productos");
    }
}

export async function getProduct(id) {
    try {
        validateId(id);

        const product = await Products.findById(id).populate("category");
        if (!product) throw new HttpError(404, "No existe este producto");
        return product;
    } catch (err) {
        throw mapError(err, "Error al obtener el producto");
    }
}

export async function updateProduct(id, body) {
    try {
        validateId(id);

        const previous = await Products.findById(id);
        if (!previous) throw new HttpError(404, "El producto no existe");

        const data = {};
        for (const field of ["name", "description", "price", "stock", "category"]) {
            if (body[field] !== undefined) data[field] = body[field];
        }

        let categoryChanged = false;
        if (data.category !== undefined) {
            const category = await resolveCategory(data.category);
            if (!category) throw new HttpError(404, `La categoría "${data.category}" no existe`);

            data.category = category._id;
            categoryChanged = String(previous.category) !== String(category._id);
        }

        const product = await Products.findByIdAndUpdate(id, data, {
            returnDocument: "after",
            runValidators: true
        });

        if (!product) throw new HttpError(404, "El producto no existe");

        if (categoryChanged) {
            if (previous.category) {
                await Category.updateOne({ _id: previous.category }, { $inc: { productCount: -1 } });
            }
            if (product.category) {
                await Category.updateOne({ _id: product.category }, { $inc: { productCount: 1 } });
            }
        }

        await product.populate("category");
        return product;
    } catch (err) {
        throw mapError(err, "Error al actualizar el producto");
    }
}

export async function deleteProduct(id) {
    try {
        validateId(id);

        const product = await Products.findByIdAndDelete(id);
        if (!product) throw new HttpError(404, "El producto no existe");

        if (product.category) {
            await Category.updateOne({ _id: product.category }, { $inc: { productCount: -1 } });
        }

        return product;
    } catch (err) {
        throw mapError(err, "Error al eliminar el producto");
    }
}
