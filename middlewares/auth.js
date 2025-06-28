const jwt = require('jsonwebtoken');
const config = require('../config');
const Usuario = require('../models');

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ mensaje: 'Acceso no autorizado' });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Acceso no autorizado' });
        }

        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Acceso no autorizado' });
    }
};

exports.authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ mensaje: 'Acceso prohibido' });
        }
        next();
    };
};