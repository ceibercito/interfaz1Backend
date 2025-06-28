const express = require('express');
const router = express.Router(); // Asegúrate de crear el router correctamente
const librosController = require('../controllers/librosController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateLibro } = require('../middlewares/validators');

// Configuración de rutas
router.get('/', librosController.getLibros);
router.get('/search', librosController.searchLibros);
router.get('/:id', librosController.getLibroById);

// Rutas protegidas
//router.use(authenticate);
//router.use(authorize(['admin']));

router.post('/', validateLibro, librosController.createLibro);
router.put('/:id', validateLibro, librosController.updateLibro);
router.delete('/:id', librosController.deleteLibro);

// Exportación CORRECTA del router
module.exports = router;