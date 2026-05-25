const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const messageRoutes = require('./routes/messages');

const app = express();

// Настройка безопасности
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.tailwindcss.com", "'unsafe-inline'"],
            styleSrc: ["'self'", "https://cdn.tailwindcss.com", "'unsafe-inline'"],
        }
    }
}));

// CORS
app.use(cors());

// Парсеры
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы (фронтенд)
app.use(express.static(path.join(__dirname, '../public')));

// Маршруты API
app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/rooms', messageRoutes);

// Все остальные пути -> index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;