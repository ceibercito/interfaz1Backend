const sequelize = require('./db');
const { DataTypes } = require('sequelize');

// Definición de modelos
const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Libro = sequelize.define('Libro', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    autor: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Prestamo = sequelize.define('Prestamo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fechaPrestamo: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fechaDevolucion: {
        type: DataTypes.DATE
    }
});

// Definición de relaciones
Usuario.hasMany(Prestamo, { foreignKey: 'usuarioId' });
Prestamo.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Libro.hasMany(Prestamo, { foreignKey: 'libroId' });
Prestamo.belongsTo(Libro, { foreignKey: 'libroId' });

// Función de conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');
        await sequelize.sync(); // Sincroniza modelos con la DB
        console.log('🔄 Modelos sincronizados');
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        process.exit(1); // Termina el proceso si hay error
    }
};

module.exports = {
    sequelize,
    testConnection,
    Usuario,
    Libro,
    Prestamo
};