/* ========================================
   GOCLEAN - ASSISTENTE OTIMIZADO
   Foco: Conversão rápida para WhatsApp
   ======================================== */

class GoCleanAssistant {
    constructor() {
        // Elementos do DOM
        this.floatingBtn = document.getElementById('botFloatingButton');
        this.chatContainer = document.getElementById('botChatContainer');
        this.closeBtn = document.getElementById('botCloseButton');
        this.messagesList = document.getElementById('botMessagesList');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.nameInputContainer = document.getElementById('nameInputContainer');
        this.nameInput = document.getElementById('botNameInput');

        // Estado simplificado
        this.isOpen = false;
        this.isTyping = false;

        this.selectedOptions = {
            tipoEstofado: null,
            nivelSujeira: null,
            nome: null
        };

        // ⚠️ ALTERE AQUI
        this.whatsappNumber = '5547991597258';

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.showInitialMessage();
    }

    attachEventListeners() {
        this.floatingBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());

        // Enter no nome = enviar
        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendToWhatsApp();
        });
    }

    toggleChat() {
        this.isOpen ? this.closeChat() : this.openChat();
    }

    openChat() {
        this.isOpen = true;
        this.chatContainer.classList.add('active');
    }

    closeChat() {
        this.isOpen = false;
        this.chatContainer.classList.add('closing');
        setTimeout(() => {
            this.chatContainer.classList.remove('active', 'closing');
        }, 300);
    }

    // ===============================
    // INÍCIO DO FLUXO (VENDA)
    // ===============================
    showInitialMessage() {
        setTimeout(() => {
            this.addBotMessage(
                '💧 Seu sofá está sujo ou com mau cheiro?\n\n' +
                'A gente resolve isso pra você 😉\n\n' +
                '👉 Qual estofado deseja limpar?'
            );

            this.showQuickReplies([
                { text: '🛋️ Sofá', value: 'sofa' },
                { text: '🪑 Poltrona', value: 'poltrona' },
                { text: '🛏️ Colchão', value: 'colchao' },
                { text: '🪑 Cadeiras', value: 'cadeiras' }
            ], 'tipoEstofado');
        }, 400);
    }

    sendMessage(userText, value, step) {
        this.addUserMessage(userText);
        this.selectedOptions[step] = value;

        this.showTypingIndicator();

        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateBotResponse(step);
        }, 700);
    }

    generateBotResponse(step) {
        switch(step) {

            case 'tipoEstofado':
                this.addBotMessage(
                    'Perfeito 👍\n\nComo está o estado do estofado?'
                );

                this.showQuickReplies([
                    { text: '✨ Pouco sujo', value: 'leve' },
                    { text: '🧹 Sujeira média', value: 'medio' },
                    { text: '🔴 Bem sujo / manchas', value: 'pesado' }
                ], 'nivelSujeira');
                break;

            case 'nivelSujeira':
                this.addBotMessage(
                    'Show! Último passo 👇\n\nQual é o seu nome?'
                );
                this.showNameInput();
                break;
        }
    }

    // ===============================
    // UI MENSAGENS
    // ===============================
    addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'message user';
        div.textContent = text;
        this.messagesList.appendChild(div);
        this.scrollToBottom();
    }

    addBotMessage(text) {
        const div = document.createElement('div');
        div.className = 'message bot';
        div.textContent = text;
        this.messagesList.appendChild(div);
        this.scrollToBottom();
    }

    showQuickReplies(replies, step) {
        const container = document.createElement('div');
        container.className = 'action-buttons';

        replies.forEach(r => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
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
        this.nameInput.focus();
        this.scrollToBottom();
    }

    // ===============================
    // WHATSAPP (CONVERSÃO)
    // ===============================
    sendToWhatsApp() {
        const nome = this.nameInput.value.trim();

        if (!nome) {
            alert('Digite seu nome 😉');
            this.nameInput.focus();
            return;
        }

        this.selectedOptions.nome = nome;
        this.addUserMessage(nome);

        const message = this.buildWhatsAppMessage();
        const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;

        this.showTypingIndicator();

        setTimeout(() => {
            this.hideTypingIndicator();

            this.addBotMessage(
                '✅ Perfeito! Agora é só clicar abaixo para falar direto no WhatsApp 👇'
            );

            const container = document.createElement('div');
            container.className = 'action-buttons';

            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.innerHTML = '💬 Ir para WhatsApp';

            btn.style.background = '#25D366';
            btn.style.color = '#fff';

            btn.addEventListener('click', () => {
                window.open(url, '_blank');
            });

            container.appendChild(btn);
            this.messagesList.appendChild(container);
            this.scrollToBottom();

        }, 700);

        this.nameInput.value = '';
        this.nameInputContainer.style.display = 'none';
    }

    buildWhatsAppMessage() {
        const tipo = this.getDisplayName('tipoEstofado', this.selectedOptions.tipoEstofado);
        const sujeira = this.getDisplayName('nivelSujeira', this.selectedOptions.nivelSujeira);
        const nome = this.selectedOptions.nome;

        return `
Olá! 👋

Me chamo *${nome}* e gostaria de um orçamento.

🛋️ Estofado: ${tipo}
🔍 Estado: ${sujeira}

Pode me passar valores e disponibilidade? 😊
        `.trim();
    }

    getDisplayName(type, value) {
        const map = {
            tipoEstofado: {
                sofa: 'Sofá',
                poltrona: 'Poltrona',
                colchao: 'Colchão',
                cadeiras: 'Cadeiras'
            },
            nivelSujeira: {
                leve: 'Pouco sujo',
                medio: 'Sujeira média',
                pesado: 'Bem sujo / manchas'
            }
        };

        return map[type]?.[value] || value;
    }

    // ===============================
    // UX
    // ===============================
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
        }, 0);
    }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    new GoCleanAssistant();
});