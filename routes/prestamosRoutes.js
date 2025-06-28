const express = require('express');
const router = express.Router();

// Importar el controlador (si lo tienes)
// const prestamosController = require('../controllers/prestamosController');

// Ruta GET de ejemplo (ajusta según tu lógica)
router.get('/', (req, res) => {
    res.json({ message: "Lista de préstamos" });
});

// Ruta POST de ejemplo
router.post('/', (req, res) => {
    res.json({ message: "Préstamo creado" });
});

// Exportar el router
module.exports = router;