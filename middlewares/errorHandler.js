// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log del error

    // Respuesta al cliente
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Error interno del servidor",
    });
};

module.exports = errorHandler; // Exporta SOLO la función