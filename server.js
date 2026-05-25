const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const initializeSocket = require('./socket');

const PORT = process.env.PORT || 3000;

// Создаем HTTP сервер
const httpServer = http.createServer(app);

// Создаем Socket.IO сервер
const io = new Server(httpServer, {
    cors: {
        origin: '*', // В продакшене замените на конкретный домен
        methods: ['GET', 'POST']
    }
});

// Сохраняем io в app для доступа из других мест
app.set('io', io);

// Инициализируем сокеты
initializeSocket(io);

// Запускаем сервер
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});