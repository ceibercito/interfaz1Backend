const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./models'); // Corregido: importar desde ./models
const errorHandler = require('./middlewares/errorHandler');

// Importar rutas
const librosRoutes = require('./routes/librosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const prestamosRoutes = require('./routes/prestamosRoutes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/libros', librosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/prestamos', prestamosRoutes);

// Manejo de errores
app.use(errorHandler);

// Conexión a la base de datos e inicio del servidor
const startServer = async () => {
    try {
        await testConnection();
        const PORT = process.env.PORT || 3000;
        const server = app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
        return server;
    } catch (error) {
        console.error('🔥 Error al iniciar:', error);
        process.exit(1);
    }
};

// Solo inicia el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = app;