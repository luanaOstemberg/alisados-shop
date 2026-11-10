import { setServers } from 'dns';
import { connect } from 'mongoose';

setServers(['8.8.8.8', '1.1.1.1']);

export default async function connectDB() {
    try {
        await connect(process.env.MONGODB_URI);
        console.log('Conectado a la base de datos exitosamente');
    } catch (err) {
        console.error('Error de conexión:', err);
        process.exit();
    }
} 