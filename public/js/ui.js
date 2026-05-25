const ui = {
    currentTab: 'login',

    switchTab(tab) {
        this.currentTab = tab;
        
        const loginBtn = document.getElementById('tab-login');
        const registerBtn = document.getElementById('tab-register');
        const nameField = document.getElementById('name-field');
        const submitBtn = document.querySelector('#auth-form button');
        
        if (tab === 'login') {
            loginBtn.className = 'py-2 px-4 text-white font-semibold border-b-2 border-[#5865f2]';
            registerBtn.className = 'py-2 px-4 text-[#949ba4] font-semibold';
            nameField?.classList.add('hidden');
            submitBtn.textContent = 'Войти';
        } else {
            registerBtn.className = 'py-2 px-4 text-white font-semibold border-b-2 border-[#5865f2]';
            loginBtn.className = 'py-2 px-4 text-[#949ba4] font-semibold';
            nameField?.classList.remove('hidden');
            submitBtn.textContent = 'Зарегистрироваться';
        }
        this.clearError();
    },

    showError(message, elementId = 'auth-error') {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
            el.classList.remove('hidden');
        }
    },

    clearError(elementId = 'auth-error') {
        const el = document.getElementById(elementId);
        if (el) el.classList.add('hidden');
    },

    renderRooms(rooms, currentRoomId, onSelect) {
        const list = document.getElementById('rooms-list');
        if (!list) return;
        
        list.innerHTML = '';
        rooms.forEach(room => {
            const li = document.createElement('li');
            const isActive = room.id === currentRoomId;
            li.className = `px-2 py-1.5 rounded cursor-pointer text-sm ${isActive ? 'bg-[#1e1f22] text-white' : 'text-[#949ba4] hover:bg-[#1e1f22] hover:text-white'}`;
            li.innerHTML = `
                <div class="flex items-center gap-2">
                    <span>#</span>
                    <span class="truncate flex-1">${room.name}</span>
                </div>
            `;
            li.addEventListener('click', () => onSelect(room));
            list.appendChild(li);
        });
    },

    renderMessages(messages, currentUserId) {
        const area = document.getElementById('messages-area');
        if (!area) return;
        
        // Очищаем, кроме пустых состояний
        Array.from(area.children).forEach(el => {
            if (el.id !== 'empty-state' && el.id !== 'join-state') el.remove();
        });
        
        messages.forEach(msg => {
            area.appendChild(this.createMessageEl(msg, currentUserId));
        });
        area.scrollTop = area.scrollHeight;
    },

    appendMessage(msg, currentUserId) {
        const area = document.getElementById('messages-area');
        if (!area) return;
        
        // Убираем пустые состояния, если они есть
        const empty = document.getElementById('empty-state');
        const join = document.getElementById('join-state');
        if (empty) empty.classList.add('hidden');
        if (join) join.classList.add('hidden');
        
        area.appendChild(this.createMessageEl(msg, currentUserId));
        area.scrollTop = area.scrollHeight;
    },

    createMessageEl(msg, currentUserId) {
        const isOwn = msg.senderId === currentUserId;
        const div = document.createElement('div');
        div.className = `flex flex-col ${isOwn ? 'items-end' : 'items-start'}`;
        div.innerHTML = `
            <span class="text-[#949ba4] text-xs mb-1">${msg.senderName || msg.sender?.name || 'User'}</span>
            <div class="max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${isOwn ? 'bg-[#5865f2] text-white' : 'bg-[#383a40] text-white'}">
                ${this.escapeHtml(msg.content)}
            </div>
        `;
        return div;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    renderMembers(members, onlineIds) {
        const list = document.getElementById('members-list');
        if (!list) return;
        
        list.innerHTML = '';
        members.forEach(user => {
            const isOnline = onlineIds.has(user.id);
            const li = document.createElement('li');
            li.className = 'flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#949ba4]';
            li.innerHTML = `
                <div class="relative shrink-0">
                    <div class="w-7 h-7 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-bold">
                        ${(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#2b2d31] ${isOnline ? 'bg-green-500' : 'bg-[#747f8d]'}"></span>
                </div>
                <span class="truncate">${user.name || user.email}</span>
            `;
            list.appendChild(li);
        });
    },

    setRoomHeader(room) {
        const roomNameEl = document.getElementById('room-name');
        const leaveBtn = document.getElementById('btn-leave-room');
        
        if (roomNameEl) {
            roomNameEl.textContent = room ? room.name : 'Выберите комнату';
        }
        if (leaveBtn) {
            if (room) leaveBtn.classList.remove('hidden');
            else leaveBtn.classList.add('hidden');
        }
    },

    setInputEnabled(enabled) {
        const input = document.getElementById('message-input');
        const sendBtn = document.getElementById('btn-send');
        
        if (input) {
            input.disabled = !enabled;
            input.placeholder = enabled ? 'Введите сообщение...' : 'Сначала выберите комнату';
        }
        if (sendBtn) sendBtn.disabled = !enabled;
    },

    showEmptyState() {
        const empty = document.getElementById('empty-state');
        const join = document.getElementById('join-state');
        if (empty) empty.classList.remove('hidden');
        if (join) join.classList.add('hidden');
    },

    showJoinState() {
        const empty = document.getElementById('empty-state');
        const join = document.getElementById('join-state');
        if (empty) empty.classList.add('hidden');
        if (join) join.classList.remove('hidden');
    },

    clearMessages() {
        const area = document.getElementById('messages-area');
        if (!area) return;
        
        Array.from(area.children).forEach(el => {
            if (el.id !== 'empty-state' && el.id !== 'join-state') el.remove();
        });
    },

    showModal() {
        const modal = document.getElementById('modal-create');
        if (modal) {
            modal.classList.remove('hidden');
            document.getElementById('input-room-name')?.focus();
        }
    },

    hideModal() {
        const modal = document.getElementById('modal-create');
        if (modal) {
            modal.classList.add('hidden');
            const input = document.getElementById('input-room-name');
            if (input) input.value = '';
            const error = document.getElementById('room-error');
            if (error) error.classList.add('hidden');
        }
    },

    setUser(user) {
        const nameSpan = document.getElementById('user-name');
        const avatarSpan = document.getElementById('user-avatar');
        
        if (nameSpan) {
            nameSpan.textContent = user.name || user.email?.split('@')[0] || 'User';
        }
        if (avatarSpan) {
            avatarSpan.textContent = (user.name || user.email || 'U').charAt(0).toUpperCase();
        }
    }
};