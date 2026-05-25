import prisma from '../prisma/prismaClient.js';
import AppError from '../utils/appError.js';

// Вспомогательная функция: поиск пользователя по Supabase ID
async function getUserBySupabaseId(supabaseId) {
    const user = await prisma.user.findUnique({ where: { supabaseId } });
    if (!user) throw new AppError('Пользователь не найден', 404);
    return user;
}

// Получение списка всех комнат (сортировка: сначала новые)
export async function getRooms() {
    return prisma.room.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

// Получение комнаты по её ID
export async function getRoomById(id) {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) throw new AppError('Комната не найдена', 404);
    return room;
}

// Создание новой комнаты с добавлением создателя как участника
export async function createRoom(name, supabaseId) {
    const user = await getUserBySupabaseId(supabaseId);
    
    // Проверка уникальности названия комнаты
    const existing = await prisma.room.findUnique({ where: { name } });
    if (existing) throw new AppError('Комната с таким названием уже существует', 400);
    
    const room = await prisma.room.create({ data: { name } });
    await prisma.roomMember.create({ data: { roomId: room.id, userId: user.id } });
    return room;
}

// Удаление комнаты по ID
export async function deleteRoom(id) {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) throw new AppError('Комната не найдена', 404);
    await prisma.room.delete({ where: { id } });
}

// Добавление пользователя в комнату
export async function joinRoom(roomId, supabaseId) {
    const user = await getUserBySupabaseId(supabaseId);
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError('Комната не найдена', 404);
    
    // Проверка, не состоит ли пользователь уже в комнате
    const existing = await prisma.roomMember.findUnique({ 
        where: { userId_roomId: { userId: user.id, roomId: roomId } } 
    });
    if (existing) throw new AppError('Вы уже в этой комнате', 400);

    return prisma.roomMember.create({ data: { roomId, userId: user.id } });
}

// Удаление пользователя из комнаты
export async function leaveRoom(roomId, supabaseId) {
    const user = await getUserBySupabaseId(supabaseId);
    const member = await prisma.roomMember.findUnique({ 
        where: { userId_roomId: { userId: user.id, roomId: roomId } } 
    });
    if (!member) throw new AppError('Вы не в этой комнате', 400);
    await prisma.roomMember.delete({ where: { userId_roomId: { userId: user.id, roomId: roomId } } });
}