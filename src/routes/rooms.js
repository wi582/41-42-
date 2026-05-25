import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { createRoomSchema } from '../validators/room.js';
import { validate } from '../validators/auth.js';
import * as roomController from '../controllers/roomController.js';

const router = Router();

// Получение списка всех комнат
router.get('/', authenticate, roomController.getRooms);

// Получение информации о конкретной комнате по ID
router.get('/:id', authenticate, roomController.getRoomById);

// Создание новой комнаты с валидацией названия
router.post('/', authenticate, validate(createRoomSchema), roomController.createRoom);

// Удаление комнаты по ID
router.delete('/:id', authenticate, roomController.deleteRoom);

// Добавление текущего пользователя в комнату
router.post('/:id/join', authenticate, roomController.joinRoom);

// Удаление текущего пользователя из комнаты
router.post('/:id/leave', authenticate, roomController.leaveRoom);

export default router;