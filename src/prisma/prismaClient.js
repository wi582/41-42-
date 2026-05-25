import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Создание адаптера с пулом соединений PostgreSQL
const adapter = new PrismaPg(
    new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    }),
);

// Создание экземпляра PrismaClient с адаптером для работы через пул соединений
const prisma = new PrismaClient({ adapter });

export default prisma;