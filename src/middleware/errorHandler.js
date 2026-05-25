// Глобальный middleware для централизованной обработки ошибок
const errorHandler = (err, req, res, next) => {
    // Если ошибка операционная (ожидаемая, например валидация)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }

    // Логирование неожиданных ошибок (баги, проблемы с БД и т.д.)
    console.error("Необработанная ошибка:", err);
    
    // Возврат общей ошибки сервера для неожиданных случаев
    res.status(500).json({
        status: "error",
        message: "Что-то пошло не так. Пожалуйста, попробуйте позже.",
    });
};

export default errorHandler;