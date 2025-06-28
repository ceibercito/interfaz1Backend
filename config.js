module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'tu_super_secreto_jwt_para_desarrollo',
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB: {
        dialect: 'sqlite',
        storage: './database/biblioteca.db'
    }
};