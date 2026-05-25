// Кастомный класс для обработки операционных ошибок приложения
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Определение статуса: "fail" для ошибок клиента (4xx), "error" для серверных (5xx)
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        // Флаг для отличия ожидаемых ошибок от непредвиденных (баги, проблемы с БД)
        this.isOperational = true;
        // Сохранение стека вызовов для отладки
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;