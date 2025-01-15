-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS mspbd;
USE mspbd;

-- Tabla de rol
CREATE TABLE IF NOT EXISTS rol (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuario
CREATE TABLE IF NOT EXISTS usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    rol_id INT NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    ultimo_acceso TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES rol(id)
);

-- Tabla de categoría
CREATE TABLE categoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de noticia
CREATE TABLE noticia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    extracto TEXT,
    contenido LONGTEXT,
    imagen VARCHAR(255),
    autor_id INT NOT NULL,
    categoria_id INT NOT NULL,
    estado ENUM('borrador', 'publicado', 'archivado') DEFAULT 'borrador',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    video_id VARCHAR(20),
    video_titulo VARCHAR(255),
    video_descripcion TEXT,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    FOREIGN KEY (autor_id) REFERENCES usuario(id)
);

-- Tabla de video
CREATE TABLE video (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(260) NOT NULL UNIQUE,
    youtube_id VARCHAR(20) NOT NULL,
    descripcion TEXT,
    miniatura VARCHAR(255),
    autor_id INT NOT NULL,
    categoria_id INT NOT NULL,
    estado ENUM('borrador', 'publicado', 'archivado') DEFAULT 'borrador',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    FOREIGN KEY (autor_id) REFERENCES usuario(id)
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_noticia_fecha ON noticia(fecha_creacion);
CREATE INDEX idx_video_fecha ON video(fecha_creacion);
CREATE INDEX idx_noticia_estado ON noticia(estado);
CREATE INDEX idx_video_estado ON video(estado);
CREATE INDEX idx_categoria_estado ON categoria(estado);

-- Añadir índices para los slugs
CREATE INDEX idx_noticia_slug ON noticia(slug);
CREATE INDEX idx_video_slug ON video(slug);

-- Insertar roles básicos
INSERT INTO rol (nombre, descripcion) VALUES
('administrador', 'Administrador del sistema'),
('editor', 'Editor de contenido');

-- Insertar rol de administrador por defecto
INSERT INTO rol (nombre, descripcion) VALUES 
('Administrador', 'Rol con todos los permisos del sistema'); 