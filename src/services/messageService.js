import prisma from '../prisma/prismaClient.js';
import AppError from '../utils/appError.js';

// Вспомогательная функция: поиск пользователя по Supabase ID
async function getUserBySupabaseId(supabaseId) {
    const user = await prisma.user.findUnique({ where: { supabaseId } });
    if (!user) throw new AppError('Пользователь не найден', 404);
    return user;
}

// Получение всех сообщений в комнате с данными отправителя
export async function getMessages(roomId) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError('Комната не найдена', 404);

    return prisma.message.findMany({
        where: { roomId },
        orderBy: { createdAt: 'asc' },  // Сортировка от старых к новым
        include: { sender: { select: { id: true, name: true, email: true } } },
    });
}

// Создание нового сообщения в комнате
export async function createMessage(roomId, supabaseId, content) {
    const user = await getUserBySupabaseId(supabaseId);
    
    // Проверка, что пользователь состоит в комнате
    const member = await prisma.roomMember.findUnique({
        where: { userId_roomId: { userId: user.id, roomId } }
    });
    if (!member) throw new AppError('Вы не являетесь участником этой комнаты', 403);

    return prisma.message.create({
        data: { roomId, senderId: user.id, content },
        include: { sender: { select: { id: true, name: true, email: true } } },
    });
}