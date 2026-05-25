import { z } from 'zod';

// Схема валидации для создания сообщения
export const createMessageSchema = z.object({
    content: z.string().min(1).max(2000),  // Сообщение не может быть пустым и не длиннее 2000 символов
});