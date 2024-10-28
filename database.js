import mongoose from 'mongoose';

const dbConnect = async () => {
    const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/eCashPlay";
    
    // Configuraciones adicionales de Mongoose
    mongoose.set('strictQuery', false);

    try {
        // Conexión a la base de datos usando await
        await mongoose.connect(DB_URI, {
            dbName: "eCashPlay",
            /* useNewUrlParser: true,
            useUnifiedTopology: true */
        });
        console.log("Successful connection to database");
    } catch (err) {
        // Manejo de errores de conexión
        console.error("Incorrect connection to database:", err);
    }
};

export default dbConnect;
