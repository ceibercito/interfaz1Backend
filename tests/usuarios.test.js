const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models/db');
const Usuario = require('../models/Usuario');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

describe('Usuarios API', () => {
    test('POST /api/usuarios/register - Debería registrar un nuevo usuario', async () => {
        const usuarioData = {
            nombre: 'Juan Pérez',
            email: 'juan@example.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/usuarios/register')
            .send(usuarioData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.usuario.email).toBe(usuarioData.email);
    });

    test('POST /api/usuarios/login - Debería autenticar un usuario', async () => {
        // Primero creamos un usuario
        await Usuario.create({
            nombre: 'Maria García',
            email: 'maria@example.com',
            password: '$2a$10$ejemploDeHash', // Contraseña: "password123"
            rol: 'usuario'
        });

        const response = await request(app)
            .post('/api/usuarios/login')
            .send({
                email: 'maria@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});