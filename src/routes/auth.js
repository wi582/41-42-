import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';
import { validate, registerSchema, loginSchema } from '../validators/auth.js';

const router = Router();

// Регистрация нового пользователя с валидацией данных
router.post('/register', validate(registerSchema), authController.register);

// Вход пользователя с валидацией email и пароля
router.post('/login', validate(loginSchema), authController.login);

// Выход пользователя (требуется JWT токен)
router.post('/logout', authenticate, authController.logout);

export default router;