import { z } from "zod";
import AppError from "../utils/appError.js";

// Middleware для валидации данных запроса по переданной схеме
export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return next(new AppError(result.error.errors[0].message, 400));
        }
        req.body = result.data;  // Замена на валидированные данные
        next();
    };
}

// Схема валидации для регистрации: email, пароль (мин. 8 символов), имя (опционально)
export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1).optional(),
});

// Схема валидации для входа: email и пароль
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});