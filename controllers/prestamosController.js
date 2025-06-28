const { Prestamo, Libro, Usuario } = require('../models');

// Crear nuevo préstamo
const crearPrestamo = async (req, res) => {
    try {
        const { libroId, usuarioId, fechaDevolucion } = req.body;

        const prestamo = await Prestamo.create({
            libroId,
            usuarioId,
            fechaDevolucion: fechaDevolucion || null
        });

        res.status(201).json(prestamo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar todos los préstamos
const listarPrestamos = async (req, res) => {
    try {
        const prestamos = await Prestamo.findAll({
            include: [
                { model: Libro },
                { model: Usuario }
            ]
        });
        res.status(200).json(prestamos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Devolver un préstamo
const devolverPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const prestamo = await Prestamo.findByPk(id);

        if (!prestamo) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        prestamo.fechaDevolucion = new Date();
        await prestamo.save();

        res.status(200).json(prestamo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    crearPrestamo,
    listarPrestamos,
    devolverPrestamo
};