import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'La categoria es requerida.'],
        unique: [true, 'La categoria ya está creada']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida.']
    }
})

const Category = mongoose.model('Categories', categorySchema);

export default Category;