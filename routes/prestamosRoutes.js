const express = require('express');
const router = express.Router();

// Importar el controlador (si lo tienes)
const prestamosController = require('../controllers/prestamosController');

// Ruta GET de ejemplo (ajusta según tu lógica)
// Listar todos los préstamos
router.get('/', prestamosController.listarPrestamos);

// Crear nuevo préstamo
router.post('/', prestamosController.crearPrestamo);

// Devolver un préstamo (por ID)
router.put('/:id/devolver', prestamosController.devolverPrestamo);
// Exportar el router
module.exports = router;