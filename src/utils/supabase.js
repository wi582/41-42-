import { createClient } from '@supabase/supabase-js';
import config from '../config.js';

// Создание и настройка клиента Supabase для взаимодействия с сервисами платформы
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export default supabase;