import mongoose from 'mongoose';

const productsSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es requerido.']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida.'],
    },
    price: {
        type: Number,
        get: v => (v / 100).toFixed(2),
        set: v => v * 100,
        required: [true, 'El precio es requerido.']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es requerido.']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Categories'
    },
});

const Products = mongoose.model('Products', productsSchema);

export default Products;