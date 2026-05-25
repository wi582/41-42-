import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { createMessageSchema } from '../validators/message.js';
import { validate } from '../validators/auth.js';
import * as messageController from '../controllers/messageController.js';

const router = Router();

// Получение всех сообщений в комнате (требуется авторизация)
router.get('/:id/messages', authenticate, messageController.getMessages);

// Отправка нового сообщения в комнату с валидацией содержимого
router.post('/:id/messages', authenticate, validate(createMessageSchema), messageController.createMessage);

export default router;