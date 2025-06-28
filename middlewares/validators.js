const { check, validationResult } = require('express-validator');

exports.validateLibro = [
    check('titulo').notEmpty().withMessage('El título es requerido'),
    check('autor').notEmpty().withMessage('El autor es requerido'),
    check('isbn').optional().isISBN().withMessage('ISBN inválido'),
    check('añoPublicacion').optional().isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage('Año de publicación inválido'),
    check('cantidadDisponible').optional().isInt({ min: 0 }).withMessage('Cantidad debe ser un número positivo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.validateUsuario = [
    check('nombre').notEmpty().withMessage('El nombre es requerido'),
    check('email').isEmail().withMessage('Email inválido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];