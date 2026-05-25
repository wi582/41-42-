const state = {
    user: null,
    rooms: [],
    currentRoom: null,
    members: [],
    onlineIds: new Set(),
    myRoomIds: new Set(),
    pendingRoom: null
};

// ========== АВТОРИЗАЦИЯ ==========
const authForm = document.getElementById('auth-form');
if (authForm) {
    document.getElementById('tab-login')?.addEventListener('click', () => ui.switchTab('login'));
    document.getElementById('tab-register')?.addEventListener('click', () => ui.switchTab('register'));

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        ui.clearError();

        const email = document.getElementById('input-email').value.trim();
        const password = document.getElementById('input-password').value.trim();

        try {
            if (ui.currentTab === 'register') {
                const name = document.getElementById('input-name').value.trim();
                if (!name) throw new Error('Введите имя');
                await api.register(email, password, name);
            }
            
            const data = await api.login(email, password);
            localStorage.setItem('token', data.session?.access_token || data.token);
            window.location.href = '/chat.html';
        } catch (err) {
            ui.showError(err.message);
        }
    });
}

// ========== ЧАТ ==========
const roomsList = document.getElementById('rooms-list');
if (roomsList) {
    const token = api.getToken();
    if (!token) {
        window.location.href = '/login.html';
    } else {
        initChat();
    }
}

async function initChat() {
    // Получаем пользователя
    state.user = await api.getMe();
    ui.setUser(state.user);

    // Подключаем сокет
    socketClient.connect(api.getToken());

    // Обработчики сокетов
    socketClient.onMessage((msg) => {
        if (msg.roomId === state.currentRoom?.id) {
            ui.appendMessage(msg, state.user?.id);
        }
    });

    socketClient.onRoomUsers((members) => {
        state.members = members;
        state.onlineIds = new Set(members.map(m => m.id));
        ui.renderMembers(state.members, state.onlineIds);
    });

    socketClient.onUserOnline(({ userId, username }) => {
        if (state.currentRoom) {
            state.onlineIds.add(userId);
            if (!state.members.find(m => m.id === userId)) {
                state.members.push({ id: userId, name: username });
            }
            ui.renderMembers(state.members, state.onlineIds);
        }
    });

    socketClient.onUserOffline(({ userId }) => {
        if (state.currentRoom) {
            state.onlineIds.delete(userId);
            ui.renderMembers(state.members, state.onlineIds);
        }
    });

    socketClient.onError(({ message }) => {
        console.error('Socket error:', message);
        ui.showError(message, 'room-error');
    });

    socketClient.onRoomJoined(({ roomId }) => {
        if (state.myRoomIds && !state.myRoomIds.has(roomId)) {
            state.myRoomIds.add(roomId);
            ui.renderRooms(state.rooms, state.currentRoom?.id, selectRoom);
        }
    });

    socketClient.onRoomLeft(({ roomId }) => {
        if (state.myRoomIds) {
            state.myRoomIds.delete(roomId);
            ui.renderRooms(state.rooms, state.currentRoom?.id, selectRoom);
        }
    });

    // Загружаем комнаты
    await loadRooms();

    // Кнопка выхода
    document.getElementById('btn-logout')?.addEventListener('click', async () => {
        try {
            await api.logout();
        } finally {
            localStorage.clear();
            socketClient.disconnect();
            window.location.href = '/login.html';
        }
    });

    // Создание комнаты
    document.getElementById('btn-create-room')?.addEventListener('click', () => ui.showModal());
    document.getElementById('btn-cancel-room')?.addEventListener('click', () => ui.hideModal());
    document.getElementById('btn-confirm-room')?.addEventListener('click', async () => {
        const name = document.getElementById('input-room-name').value.trim();
        if (!name) return;
        
        try {
            const room = await api.createRoom(name);
            state.rooms.unshift(room);
            ui.renderRooms(state.rooms, state.currentRoom?.id, selectRoom);
            ui.hideModal();
        } catch (err) {
            const errEl = document.getElementById('room-error');
            if (errEl) {
                errEl.textContent = err.message;
                errEl.classList.remove('hidden');
            }
        }
    });

    // Выход из комнаты
    document.getElementById('btn-leave-room')?.addEventListener('click', () => {
        if (!state.currentRoom) return;
        
        const roomId = state.currentRoom.id;
        socketClient.leaveRoom(roomId);
        state.currentRoom = null;
        state.members = [];
        state.onlineIds = new Set();
        localStorage.removeItem('currentRoomId');
        if (state.myRoomIds) state.myRoomIds.delete(roomId);
        
        ui.setRoomHeader(null);
        ui.setInputEnabled(false);
        ui.renderMembers([], new Set());
        ui.clearMessages();
        ui.showEmptyState();
        ui.renderRooms(state.rooms, null, selectRoom);
    });

    // Присоединение к комнате
    document.getElementById('btn-join-room')?.addEventListener('click', () => {
        if (state.pendingRoom) joinRoom(state.pendingRoom);
    });

    // Отправка сообщений
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('btn-send');
    
    const sendMessage = () => {
        const content = messageInput?.value.trim();
        if (!content || !state.currentRoom) return;
        
        socketClient.sendMessage(state.currentRoom.id, content);
        if (messageInput) messageInput.value = '';
    };
    
    sendBtn?.addEventListener('click', sendMessage);
    messageInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

async function loadRooms() {
    const [rooms, myRoomIds] = await Promise.all([
        api.getRooms(),
        api.getMyRooms()
    ]);
    
    state.rooms = rooms;
    state.myRoomIds = new Set(myRoomIds);
    
    const savedRoomId = localStorage.getItem('currentRoomId');
    if (savedRoomId && state.myRoomIds.has(savedRoomId)) {
        const room = state.rooms.find(r => r.id === savedRoomId);
        if (room) await joinRoom(room);
    } else {
        ui.renderRooms(state.rooms, state.currentRoom?.id, selectRoom);
    }
}

function selectRoom(room) {
    if (state.currentRoom?.id === room.id) return;
    
    if (state.currentRoom) {
        state.currentRoom = null;
        state.members = [];
        state.onlineIds = new Set();
        ui.setRoomHeader(null);
        ui.setInputEnabled(false);
        ui.renderMembers([], new Set());
        ui.clearMessages();
    }
    
    if (state.myRoomIds.has(room.id)) {
        joinRoom(room);
    } else {
        state.pendingRoom = room;
        ui.setRoomHeader(room);
        ui.showJoinState();
        ui.renderRooms(state.rooms, null, selectRoom);
    }
}

async function joinRoom(room) {
    state.currentRoom = room;
    localStorage.setItem('currentRoomId', room.id);
    
    ui.setRoomHeader(room);
    ui.setInputEnabled(true);
    ui.clearMessages();
    ui.showEmptyState();
    
    // Загружаем историю сообщений
    try {
        const messages = await api.getMessages(room.id);
        ui.renderMessages(messages, state.user?.id);
    } catch (err) {
        console.error('Error loading messages:', err);
    }
    
    ui.renderRooms(state.rooms, state.currentRoom.id, selectRoom);
    socketClient.joinRoom(room.id);
}