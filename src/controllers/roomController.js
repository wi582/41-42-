import * as roomService from '../services/roomService.js';

// Получение списка всех комнат
export async function getRooms(req, res, next) {
    try {
        const rooms = await roomService.getRooms();
        res.status(200).json({ rooms });
    } catch (error) {
        next(error);
    }
}

// Получение комнаты по её ID
export async function getRoomById(req, res, next) {
    try {
        const room = await roomService.getRoomById(req.params.id);
        res.status(200).json({ room });
    } catch (error) {
        next(error);
    }
}

// Создание новой комнаты с указанием создателя
export async function createRoom(req, res, next) {
    try {
        const room = await roomService.createRoom(req.body.name, req.user.sub);
        res.status(201).json({ room });
    } catch (error) {
        next(error);
    }
}

// Удаление комнаты по ID
export async function deleteRoom(req, res, next) {
    try {
        await roomService.deleteRoom(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

// Добавление текущего пользователя в комнату
export async function joinRoom(req, res, next) {
    try {
        await roomService.joinRoom(req.params.id, req.user.sub);
        res.status(200).json({ message: 'Вы вошли в комнату' });
    } catch (error) {
        next(error);
    }
}

// Удаление текущего пользователя из комнаты
export async function leaveRoom(req, res, next) {
    try {
        await roomService.leaveRoom(req.params.id, req.user.sub);
        res.status(200).json({ message: 'Вы покинули комнату' });
    } catch (error) {
        next(error);
    }
}