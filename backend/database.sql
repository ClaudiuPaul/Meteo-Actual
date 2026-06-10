-- Baza de date pentru aplicația Meteo Actual

-- Creăm baza de date dacă nu există
CREATE DATABASE IF NOT EXISTS meteo_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Selectăm baza de date
USE meteo_app;

-- Creăm tabelul pentru utilizatori
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
