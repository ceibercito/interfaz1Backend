const { validationResult } = require('express-validator');
const { Libro } = require('../models');

// Obtener todos los libros
exports.getLibros = async (req, res, next) => {
    try {
        const libros = await Libro.findAll();
        res.status(200).json(libros);
    } catch (error) {
        next(error);
    }
};

// Obtener un libro por ID
exports.getLibroById = async (req, res, next) => {
    try {
        const libro = await Libro.findByPk(req.params.id);
        if (!libro) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.status(200).json(libro);
    } catch (error) {
        next(error);
    }
};

// Crear un nuevo libro
exports.createLibro = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const libro = await Libro.create(req.body);
        res.status(201).json(libro);
    } catch (error) {
        next(error);
    }
};

// Actualizar un libro
exports.updateLibro = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const libro = await Libro.findByPk(req.params.id);
        if (!libro) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }

        await libro.update(req.body);
        res.status(200).json(libro);
    } catch (error) {
        next(error);
    }
};

// Eliminar un libro
exports.deleteLibro = async (req, res, next) => {
    try {
        const libro = await Libro.findByPk(req.params.id);
        if (!libro) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }

        await libro.destroy();
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

// Buscar libros por título, autor o categoría
exports.searchLibros = async (req, res, next) => {
    try {
        const { query } = req.query;
        const libros = await Libro.findAll({
            where: {
                [Op.or]: [
                    { titulo: { [Op.like]: `%${query}%` } },
                    { autor: { [Op.like]: `%${query}%` } },
                    { categoria: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.status(200).json(libros);
    } catch (error) {
        next(error);
    }
};