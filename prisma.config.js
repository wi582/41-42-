import { defineConfig } from 'prisma/config';
import 'dotenv/config';

// Конфигурационный файл Prisma для программного управления настройками
export default defineConfig({
    schema: './src/prisma/schema/schema.prisma',  // Путь к схеме данных
    
    generator: {                                   // Настройки генерации Prisma Client
        output: './src/prisma/generated',          // Папка для сгенерированных файлов
    },
    
    datasource: {                                  // Настройки подключения к БД
        url: process.env.DIRECT_URL,               // Строка подключения к PostgreSQL
        provider: 'postgresql',                    // Тип базы данных
    },
});