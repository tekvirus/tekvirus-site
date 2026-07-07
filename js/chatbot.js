// ============================================================
// CHATBOT
// ============================================================

class Chatbot {
    constructor() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatClose = document.getElementById('chatClose');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.isOpen = false;

        this.init();
    }

    init() {
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());

        this.chatSend.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatWindow.classList.add('active');
            this.chatInput.focus();
        } else {
            this.chatWindow.classList.remove('active');
        }
    }

    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('active');
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (message) {
            this.addMessage(message, 'user');
            this.chatInput.value = '';
            setTimeout(() => this.autoResponse(message), 900);
        }
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type === 'user' ? 'user' : 'bot');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = text;

        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    autoResponse(userMessage) {
        let response = '';
        const msg = userMessage.toLowerCase();

        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            response = "Hey! 👋 How can I help with your project today?";
        } else if (msg.includes('service') || msg.includes('services')) {
            response = "We build web apps, mobile apps, SEO, ethical hacking / security audits, digital marketing, UI/UX, video editing, and more. Which one do you need?";
        } else if (msg.includes('price') || msg.includes('cost') || msg.includes('pricing')) {
            response = "Pricing depends on scope. Call 7904321890 or email techvirusofficial@gmail.com and we'll send a custom quote.";
        } else if (msg.includes('contact') || msg.includes('phone') || msg.includes('email')) {
            response = "📞 7904321890\n📧 techvirusofficial@gmail.com\n📍 Dindigul Bus Stand, Tamil Nadu";
        } else if (msg.includes('web') || msg.includes('website')) {
            response = "We build responsive, SEO-ready websites on modern stacks. Want to tell me more about the project?";
        } else if (msg.includes('app') || msg.includes('mobile')) {
            response = "We develop native and cross-platform apps for iOS and Android. What's the app idea?";
        } else if (msg.includes('hack') || msg.includes('security') || msg.includes('ethical')) {
            response = "Our security team runs penetration tests and full vulnerability audits on your infrastructure.";
        } else if (msg.includes('book') || msg.includes('appointment')) {
            response = "You can book a slot directly — hit 'Book Online' in the navigation and pick a time that works.";
        } else if (msg.includes('team') || msg.includes('expert')) {
            response = "The core team: Mr. Alagesan (CEO), Valan Joshwa (Lead Developer), Giri Prasath (Security Analyst), Raghul (Digital Marketer), and Seeni Vasan (UI/UX Designer).";
        } else {
            response = "Thanks for the message! For anything detailed, reach us at 7904321890 or techvirusofficial@gmail.com. 😊";
        }

        this.addMessage(response, 'bot');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
