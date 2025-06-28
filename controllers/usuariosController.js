const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Usuario} = require('../models');
const config = require('../config');

// Registrar un nuevo usuario
exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombre, email, password } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }

        // Crear usuario
        const usuario = await Usuario.create({ nombre, email, password });

        // Generar token JWT
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, config.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(201).json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
    } catch (error) {
        next(error);
    }
};

// Iniciar sesión
exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const passwordValido = await usuario.validarPassword(password);
        if (!passwordValido) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, config.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(200).json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
    } catch (error) {
        next(error);
    }
};

// Obtener perfil de usuario
exports.getProfile = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id, {
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};