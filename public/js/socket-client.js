const socketClient = {
    socket: null,

    connect(token) {
        this.socket = io('/chat', {
            auth: { token },
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket error:', err.message);
        });

        return this.socket;
    },

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    },

    joinRoom(roomId) {
        this.socket?.emit('room:join', { roomId });
    },

    leaveRoom(roomId) {
        this.socket?.emit('room:leave', { roomId });
    },

    sendMessage(roomId, content) {
        this.socket?.emit('message:send', { roomId, content });
    },

    onMessage(callback) {
        this.socket?.on('message:receive', callback);
    },

    onRoomUsers(callback) {
        this.socket?.on('room:users', callback);
    },

    onRoomJoined(callback) {
        this.socket?.on('room:joined', callback);
    },

    onRoomLeft(callback) {
        this.socket?.on('room:left', callback);
    },

    onUserOnline(callback) {
        this.socket?.on('user:online', callback);
    },

    onUserOffline(callback) {
        this.socket?.on('user:offline', callback);
    },

    onError(callback) {
        this.socket?.on('error', callback);
    }
};