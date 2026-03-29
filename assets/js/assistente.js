/* ========================================
   GOCLEAN - ASSISTENTE OTIMIZADO
   Foco: Conversão rápida para WhatsApp
   Visual humanizado com avatar feminino
   ======================================== */

class GoCleanAssistant {
    constructor() {
        // Elementos do DOM
        this.floatingBtn       = document.getElementById('botFloatingButton');
        this.chatContainer     = document.getElementById('botChatContainer');
        this.closeBtn          = document.getElementById('botCloseButton');
        this.messagesList      = document.getElementById('botMessagesList');
        this.typingIndicator   = document.getElementById('typingIndicator');
        this.nameInputContainer = document.getElementById('nameInputContainer');
        this.nameInput         = document.getElementById('botNameInput');
        this.bubbleHint        = null;

        // Estado
        this.isOpen    = false;
        this.hintShown = false;

        this.selectedOptions = {
            tipoEstofado: null,
            nivelSujeira: null,
            nome: null
        };

        // ⚠️ ALTERE AQUI — seu número WhatsApp
        this.whatsappNumber = '5547991597258';

        // Nome e foto da atendente (personalize)
        this.agentName  = 'Claudia Alves';
        // Coloque o caminho da foto real ou uma URL pública.
        // Se não tiver foto, deixe null para usar o ícone de robô.
        this.agentPhoto = './assets/img/assistente-humano.jpg'; // ex: 'images/atendente.jpg'

        this.init();
    }

    init() {
        this.renderFloatingButton();
        this.renderChatHeader();
        this.attachEventListeners();
        this.createBubbleHint();
        this.showInitialMessage();
    }

    /* ─────────────────────────────────────────
       RENDERIZA BOTÃO FLUTUANTE COM AVATAR HUMANO
    ───────────────────────────────────────── */
    renderFloatingButton() {
        this.floatingBtn.innerHTML = '';

        if (this.agentPhoto) {
            const img = document.createElement('img');
            img.src       = this.agentPhoto;
            img.alt       = this.agentName;
            img.className = 'bot-avatar-img';
            this.floatingBtn.appendChild(img);
        } else {
            // Fallback: ícone de robô/chat
            const icon = document.createElement('i');
            icon.className = 'bi bi-chat-dots bot-avatar-icon';
            icon.style.cssText = 'font-size:1.6rem; color:#1D6BE8;';
            this.floatingBtn.appendChild(icon);
        }
    }

    /* ─────────────────────────────────────────
       RENDERIZA HEADER DO CHAT COM FOTO HUMANA
    ───────────────────────────────────────── */
    renderChatHeader() {
        const avatarEl = document.querySelector('.chat-avatar');
        if (!avatarEl) return;

        avatarEl.innerHTML = '';

        if (this.agentPhoto) {
            const img = document.createElement('img');
            img.src = this.agentPhoto;
            img.alt = this.agentName;
            avatarEl.appendChild(img);
        } else {
            const icon = document.createElement('i');
            icon.className = 'bi bi-robot';
            avatarEl.appendChild(icon);
        }

        // Atualiza nome no header
        const titleEl = document.querySelector('.chat-title');
        if (titleEl) titleEl.textContent = this.agentName;
    }

    /* ─────────────────────────────────────────
       BALÃO DE CHAMADA (estilo WhatsApp)
    ───────────────────────────────────────── */
    createBubbleHint() {
        // Remove se já existir
        const existing = document.getElementById('chatBubbleHint');
        if (existing) existing.remove();

        const hint = document.createElement('div');
        hint.id        = 'chatBubbleHint';
        hint.className = 'chat-bubble-hint';
        hint.innerHTML = `
            <span class="hint-name">${this.agentName}</span>
            Olá! Posso te ajudar? 😊
        `;

        // Clique no balão abre o chat
        hint.addEventListener('click', () => {
            this.openChat();
            hint.classList.add('hidden');
        });

        document.body.appendChild(hint);
        this.bubbleHint = hint;

        // Esconde o balão automaticamente após 6 segundos
        setTimeout(() => {
            if (!this.isOpen) hint.classList.add('hidden');
        }, 6000);
    }

    attachEventListeners() {
        this.floatingBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());

        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendToWhatsApp();
        });

        // Botão de envio WhatsApp
        const sendBtn = document.getElementById('botSendWhatsApp');
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendToWhatsApp());
    }

    toggleChat() {
        this.isOpen ? this.closeChat() : this.openChat();
    }

    openChat() {
        this.isOpen = true;
        if (this.bubbleHint) this.bubbleHint.classList.add('hidden');
        this.chatContainer.classList.remove('closing');
        this.chatContainer.classList.add('active');
    }

    closeChat() {
        this.isOpen = false;
        this.chatContainer.classList.add('closing');
        setTimeout(() => {
            this.chatContainer.classList.remove('active', 'closing');
        }, 300);
    }

    /* ─────────────────────────────────────────
       FLUXO DE CONVERSA
    ───────────────────────────────────────── */
    showInitialMessage() {
        setTimeout(() => {
            this.addBotMessage(
                '💧 Seu sofá está sujo ou com mau cheiro?\n\n' +
                'A gente resolve isso pra você 😉\n\n' +
                '👉 Qual estofado deseja limpar?'
            );

            this.showQuickReplies([
                { text: '🛋️ Sofá',     value: 'sofa' },
                { text: '🪑 Poltrona', value: 'poltrona' },
                { text: '🛏️ Colchão',  value: 'colchao' },
                { text: '🪑 Cadeiras', value: 'cadeiras' }
            ], 'tipoEstofado');
        }, 500);
    }

    sendMessage(userText, value, step) {
        this.addUserMessage(userText);
        this.selectedOptions[step] = value;

        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateBotResponse(step);
        }, 750);
    }

    generateBotResponse(step) {
        switch (step) {
            case 'tipoEstofado':
                this.addBotMessage('Perfeito 👍\n\nComo está o estado do estofado?');
                this.showQuickReplies([
                    { text: '✨ Pouco sujo',          value: 'leve'   },
                    { text: '🧹 Sujeira média',       value: 'medio'  },
                    { text: '🔴 Bem sujo / manchas',  value: 'pesado' }
                ], 'nivelSujeira');
                break;

            case 'nivelSujeira':
                this.addBotMessage('Show! Último passo 👇\n\nQual é o seu nome?');
                this.showNameInput();
                break;
        }
    }

    /* ─────────────────────────────────────────
       UI — MENSAGENS
    ───────────────────────────────────────── */
    addUserMessage(text) {
        const div = document.createElement('div');
        div.className   = 'message user';
        div.textContent = text;
        this.messagesList.appendChild(div);
        this.scrollToBottom();
    }

    addBotMessage(text) {
        const div = document.createElement('div');
        div.className   = 'message bot';
        div.textContent = text;
        this.messagesList.appendChild(div);
        this.scrollToBottom();
    }

    showQuickReplies(replies, step) {
        const container = document.createElement('div');
        container.className = 'action-buttons';

        replies.forEach(r => {
            const btn = document.createElement('button');
            btn.className   = 'action-btn';
            btn.textContent = r.text;

            btn.addEventListener('click', () => {
                this.sendMessage(r.text, r.value, step);
                container.remove();
            });

            container.appendChild(btn);
        });

        this.messagesList.appendChild(container);
        this.scrollToBottom();
    }

    showNameInput() {
        this.nameInputContainer.style.display = 'flex';
        setTimeout(() => this.nameInput.focus(), 100);
        this.scrollToBottom();
    }

    /* ─────────────────────────────────────────
       WHATSAPP — CONVERSÃO
    ───────────────────────────────────────── */
    sendToWhatsApp() {
        const nome = this.nameInput.value.trim();

        if (!nome) {
            this.nameInput.style.borderColor = '#EF4444';
            setTimeout(() => this.nameInput.style.borderColor = '', 1500);
            this.nameInput.focus();
            return;
        }

        this.selectedOptions.nome = nome;
        this.addUserMessage(nome);
        this.nameInputContainer.style.display = 'none';
        this.nameInput.value = '';

        const message = this.buildWhatsAppMessage();
        const url     = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;

        this.showTypingIndicator();

        setTimeout(() => {
            this.hideTypingIndicator();
            this.addBotMessage('✅ Perfeito! Clique abaixo para falar direto no WhatsApp 👇');

            const container = document.createElement('div');
            container.className = 'action-buttons';

            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.innerHTML = '<i class="bi bi-whatsapp" style="margin-right:6px;font-size:1rem;"></i> Falar no WhatsApp';
            btn.style.cssText = 'background:#25D366;color:#fff;border-color:#25D366;font-size:0.9rem;padding:13px 16px;';

            btn.addEventListener('click', () => window.open(url, '_blank'));
            container.appendChild(btn);
            this.messagesList.appendChild(container);
            this.scrollToBottom();
        }, 750);
    }

    buildWhatsAppMessage() {
        const tipo    = this.getDisplayName('tipoEstofado', this.selectedOptions.tipoEstofado);
        const sujeira = this.getDisplayName('nivelSujeira',  this.selectedOptions.nivelSujeira);
        const nome    = this.selectedOptions.nome;

        return `Olá! 👋\n\nMe chamo *${nome}* e gostaria de um orçamento.\n\n🛋️ Estofado: ${tipo}\n🔍 Estado: ${sujeira}\n\nPode me passar valores e disponibilidade? 😊`.trim();
    }

    getDisplayName(type, value) {
        const map = {
            tipoEstofado: { sofa:'Sofá', poltrona:'Poltrona', colchao:'Colchão', cadeiras:'Cadeiras' },
            nivelSujeira:  { leve:'Pouco sujo', medio:'Sujeira média', pesado:'Bem sujo / manchas' }
        };
        return map[type]?.[value] || value;
    }

    /* ─────────────────────────────────────────
       UX
    ───────────────────────────────────────── */
    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesList.scrollTop = this.messagesList.scrollHeight;
        }, 50);
    }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    new GoCleanAssistant();
});