import * as messageService from '../services/messageService.js';

// Получение всех сообщений из комнаты по ID комнаты
export async function getMessages(req, res, next) {
    try {
        const messages = await messageService.getMessages(req.params.id);
        res.status(200).json({ messages });
    } catch (error) {
        next(error);
    }
}

// Создание нового сообщения в комнате с привязкой к пользователю
export async function createMessage(req, res, next) {
    try {
        const message = await messageService.createMessage(
            req.params.id,      // ID комнаты
            req.user.sub,       // ID пользователя из JWT токена (Supabase)
            req.body.content    // Текст сообщения
        );
        res.status(201).json({ message });
    } catch (error) {
        next(error);
    }
}