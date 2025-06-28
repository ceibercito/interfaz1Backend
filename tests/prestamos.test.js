const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models/db');
const Prestamo = require('../models/Prestamo');
const Libro = require('../models/Libro');
const Usuario = require('../models/Usuario');

beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Datos de prueba
    await Usuario.create({
        nombre: 'Usuario Test',
        email: 'test@example.com',
        password: 'password123',
        rol: 'usuario'
    });

    await Libro.create({
        titulo: 'Libro de Prueba',
        autor: 'Autor de Prueba',
        cantidadDisponible: 3
    });
});

describe('Préstamos API', () => {
    test('POST /api/prestamos - Debería crear un nuevo préstamo', async () => {
        const response = await request(app)
            .post('/api/prestamos')
            .send({
                usuarioId: 1,
                libroId: 1,
                fechaDevolucionEsperada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    test('GET /api/prestamos - Debería listar préstamos', async () => {
        const response = await request(app).get('/api/prestamos');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});