import { z } from 'zod';

// Схема валидации для создания комнаты
export const createRoomSchema = z.object({
    name: z.string().min(1).max(100),  // Название комнаты: от 1 до 100 символов
});