-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('usuario', 'admin')) DEFAULT 'usuario',
    estado TEXT NOT NULL CHECK (estado IN ('activo', 'inactivo', 'suspendido')) DEFAULT 'activo',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Libros
CREATE TABLE IF NOT EXISTS Libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    isbn TEXT UNIQUE,
    editorial TEXT,
    año_publicacion INTEGER,
    categoria TEXT,
    cantidad_disponible INTEGER NOT NULL DEFAULT 0 CHECK (cantidad_disponible >= 0),
    portada_url TEXT,
    estado TEXT NOT NULL CHECK (estado IN ('disponible', 'prestado', 'reservado', 'mantenimiento')) DEFAULT 'disponible',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Préstamos
CREATE TABLE IF NOT EXISTS Prestamos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    libro_id INTEGER NOT NULL,
    fecha_prestamo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_devolucion DATETIME,
    fecha_devolucion_esperada DATETIME NOT NULL,
    estado TEXT NOT NULL CHECK (estado IN ('activo', 'devuelto', 'atrasado', 'perdido')) DEFAULT 'activo',
    multa DECIMAL(10, 2) DEFAULT 0.00 CHECK (multa >= 0),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES Libros(id) ON DELETE CASCADE
);

-- Tabla de Reservas
CREATE TABLE IF NOT EXISTS Reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    libro_id INTEGER NOT NULL,
    fecha_reserva DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion DATETIME NOT NULL,
    estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'completada', 'cancelada', 'expirada')) DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES Libros(id) ON DELETE CASCADE
);

-- Tabla de Historial
CREATE TABLE IF NOT EXISTS Historial (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    libro_id INTEGER NOT NULL,
    accion TEXT NOT NULL CHECK (accion IN ('prestamo', 'devolucion', 'reserva', 'cancelacion')),
    fecha_accion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detalles TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES Libros(id) ON DELETE CASCADE
);

-- Índices para la tabla Usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON Usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON Usuarios(rol);

-- Índices para la tabla Libros
CREATE INDEX IF NOT EXISTS idx_libros_titulo ON Libros(titulo);
CREATE INDEX IF NOT EXISTS idx_libros_autor ON Libros(autor);
CREATE INDEX IF NOT EXISTS idx_libros_categoria ON Libros(categoria);
CREATE INDEX IF NOT EXISTS idx_libros_estado ON Libros(estado);
CREATE INDEX IF NOT EXISTS idx_libros_isbn ON Libros(isbn);

-- Índices para la tabla Prestamos
CREATE INDEX IF NOT EXISTS idx_prestamos_usuario ON Prestamos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_libro ON Prestamos(libro_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_estado ON Prestamos(estado);
CREATE INDEX IF NOT EXISTS idx_prestamos_fechas ON Prestamos(fecha_prestamo, fecha_devolucion_esperada);

-- Índices para la tabla Reservas
CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON Reservas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reservas_libro ON Reservas(libro_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON Reservas(estado);


INSERT INTO Usuarios (nombre, email, password, rol)
VALUES ('Administrador', 'admin@biblioteca.com', '$2a$10$xJwL5v5Jz7fqLZQ1QbZUe.Bp8J9fL7sLk7Jk6d6XJv6nV1X2Y3Z4A', 'admin');

-- Insertar algunos libros de ejemplo
INSERT INTO Libros (titulo, autor, isbn, editorial, año_publicacion, categoria, cantidad_disponible)
VALUES
('Cien años de soledad', 'Gabriel García Márquez', '9780307474728', 'Editorial Sudamericana', 1967, 'Novela', 5),
('El Principito', 'Antoine de Saint-Exupéry', '9780156012195', 'Reynal & Hitchcock', 1943, 'Literatura infantil', 3),
('1984', 'George Orwell', '9780451524935', 'Secker & Warburg', 1949, 'Ciencia ficción', 2),
('Don Quijote de la Mancha', 'Miguel de Cervantes', '9788467034267', 'Francisco de Robles', 1605, 'Novela clásica', 4);


-- Trigger para actualizar fecha_actualizacion en Usuarios
CREATE TRIGGER IF NOT EXISTS tg_usuarios_actualizacion
AFTER UPDATE ON Usuarios
BEGIN
    UPDATE Usuarios SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para actualizar fecha_actualizacion en Libros
CREATE TRIGGER IF NOT EXISTS tg_libros_actualizacion
AFTER UPDATE ON Libros
BEGIN
    UPDATE Libros SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para actualizar cantidad disponible al prestar un libro
CREATE TRIGGER IF NOT EXISTS tg_prestamo_libro
AFTER INSERT ON Prestamos
WHEN NEW.estado = 'activo'
BEGIN
    UPDATE Libros
    SET cantidad_disponible = cantidad_disponible - 1,
        estado = CASE WHEN (cantidad_disponible - 1) <= 0 THEN 'prestado' ELSE estado END
    WHERE id = NEW.libro_id;
END;

-- Trigger para actualizar cantidad disponible al devolver un libro
CREATE TRIGGER IF NOT EXISTS tg_devolucion_libro
AFTER UPDATE ON Prestamos
WHEN NEW.estado = 'devuelto' AND OLD.estado = 'activo'
BEGIN
    UPDATE Libros
    SET cantidad_disponible = cantidad_disponible + 1,
        estado = CASE WHEN (cantidad_disponible + 1) > 0 THEN 'disponible' ELSE estado END
    WHERE id = NEW.libro_id;

    -- Registrar en el historial
    INSERT INTO Historial (usuario_id, libro_id, accion, detalles)
    VALUES (NEW.usuario_id, NEW.libro_id, 'devolucion',
            'Libro devuelto ' || IIF(NEW.fecha_devolucion > NEW.fecha_devolucion_esperada, 'con retraso', 'a tiempo'));
END;