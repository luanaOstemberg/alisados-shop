import mongoose from 'mongoose';
import ValidateEmail from '../helpers/functions/validateEmail.js';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true,
        validate: [ValidateEmail, 'Ingresá un email válido']
    },
    password: {
        type: String,
        required: [true, 'La constraseña es requerida']
    }
})

const User = mongoose.model('User', userSchema);

export default User;