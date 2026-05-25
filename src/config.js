import 'dotenv/config';

// Централизованная конфигурация приложения
const config = {
    port: process.env.PORT || 3000,                    // Порт сервера

    supabase: {                                         // Настройки Supabase
        url: process.env.SUPABASE_URL,                  // URL проекта Supabase
        anonKey: process.env.SUPABASE_ANON_KEY,         // Анонимный публичный ключ
    },

    cors: {                                             // Настройки CORS
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',   // Разрешённые источники
        credentials: true,                              // Разрешение отправки cookies
    },

    nodeEnv: process.env.NODE_ENV || 'development',     // Текущее окружение (development/production)
};

export default config;