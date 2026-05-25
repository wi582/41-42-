import supabase from '../utils/supabase.js';
import prisma from '../prisma/prismaClient.js';
import AppError from '../utils/appError.js';

// Регистрация: создание пользователя в Supabase Auth и в своей БД
export async function register(email, password, name) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new AppError(error.message, 400);

    // Создание записи в собственной таблице users
    const user = await prisma.user.create({
        data: {
            supabaseId: data.user.id,  // Связь с Supabase Auth
            email,
            name,
        },
    });

    return { user, session: data.session };
}

// Вход: аутентификация через Supabase
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new AppError('Неверный электронный адрес или пароль', 401);

    return { session: data.session };
}

// Выход: завершение сессии в Supabase
export async function logout(accessToken) {
    const { error } = await supabase.auth.signOut(accessToken);
    if (error) throw new AppError(error.message, 400);
}