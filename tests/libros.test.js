const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models/db');
const Libro = require('../models/Libro');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

describe('Libros API', () => {
    test('GET /api/libros - Debería obtener todos los libros (vacío al inicio)', async () => {
        const response = await request(app).get('/api/libros');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /api/libros - Debería crear un nuevo libro', async () => {
        const libroData = {
            titulo: 'Cien años de soledad',
            autor: 'Gabriel García Márquez',
            cantidadDisponible: 5
        };

        const response = await request(app)
            .post('/api/libros')
            .send(libroData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.titulo).toBe(libroData.titulo);
    });

    test('GET /api/libros/:id - Debería obtener un libro por ID', async () => {
        // Primero creamos un libro
        const libro = await Libro.create({
            titulo: 'El Principito',
            autor: 'Antoine de Saint-Exupéry',
            cantidadDisponible: 3
        });

        const response = await request(app).get(`/api/libros/${libro.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(libro.id);
        expect(response.body.titulo).toBe('El Principito');
    });
});