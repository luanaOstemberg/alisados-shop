import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'La categoria es requerida.'],
        unique: [true, 'La categoria ya estǭ creada']
    },
    description: {
        type: String,
        required: [true, 'La descripci��n es requerida.']
    },
    productCount: {
        type: Number,
        default: 0
    }
});

const Category = mongoose.model('Categories', categorySchema);

export default Category;