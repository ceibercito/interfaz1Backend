const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { validateUsuario } = require('../middlewares/validators');

// Rutas públicas
router.post('/register', validateUsuario, usuariosController.register);
router.post('/login', usuariosController.login);

// Rutas protegidas
//router.use(require('../middlewares/auth').authenticate);

router.get('/profile', usuariosController.getProfile);

module.exports = router;