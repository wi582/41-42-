import { createRemoteJWKSet, jwtVerify } from "jose";
import config from "../config.js";
import AppError from "../utils/appError.js";

// Набор публичных ключей Supabase для верификации подписи JWT
const JWKS = createRemoteJWKSet(
    new URL(`${config.supabase.url}/auth/v1/.well-known/jwks.json`),
);

// Издатель токена (должен совпадать с Supabase проектом)
const ISSUER = `${config.supabase.url}/auth/v1`;

// Middleware проверки JWT токена
export default async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    // Проверка наличия заголовка Authorization в формате Bearer
    if (!authHeader?.startsWith("Bearer ")) {
        return next(new AppError("Вы не авторизованы", 401));
    }

    // Извлечение токена из заголовка
    const token = authHeader.slice(7).trim();

    try {
        // Верификация токена: проверка подписи, срока действия, издателя
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: ISSUER,
            audience: "authenticated",
        });

        // Сохранение payload (данных пользователя) в объект запроса
        req.user = payload;
        next();
    } catch (err) {
        console.error("JWT verify error:", err.message);
        return next(new AppError("Недействительный или истёкший токен", 401));
    }
}