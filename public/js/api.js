const API_URL = window.location.origin;

const api = {
    getToken() {
        return localStorage.getItem('token');
    },

    authHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    },

    async request(endpoint, options = {}) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: this.authHeaders()
        });
        
        let data;
        try {
            data = await response.json();
        } catch {
            data = {};
        }
        
        if (!response.ok) {
            throw new Error(data.message || 'Ошибка запроса');
        }
        return data;
    },

    async register(email, password, name) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
    },

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async logout() {
        return this.request('/auth/logout', { method: 'POST' });
    },

    async getMe() {
        const data = await this.request('/auth/me');
        return data.user;
    },

    async getMyRooms() {
        const data = await this.request('/rooms/my');
        return data.rooms || [];
    },

    async getRooms() {
        const data = await this.request('/rooms');
        return data.rooms || [];
    },

    async createRoom(name) {
        return this.request('/rooms', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
    },

    async deleteRoom(roomId) {
        return this.request(`/rooms/${roomId}`, { method: 'DELETE' });
    },

    async getMessages(roomId) {
        const data = await this.request(`/rooms/${roomId}/messages`);
        return data.messages || [];
    }
};