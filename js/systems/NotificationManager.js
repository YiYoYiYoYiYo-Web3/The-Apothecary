export class NotificationManager {
    constructor() {
        this.container = document.getElementById('notification-area');
        this.queue = [];
        this.isShowing = false;
        this.lastMessage = null;
        this.lastTime = 0;
    }

    show(msg, type = 'info') {
        // Global Debounce (500ms)
        const now = Date.now();
        if (this.lastMessage === msg && (now - this.lastTime) < 500) {
            return;
        }
        this.lastMessage = msg;
        this.lastTime = now;

        this.createNotification(msg, type);
    }

    createNotification(msg, type) {
        const div = document.createElement('div');
        div.className = `notification ${type}`;
        div.textContent = msg;

        // Initial styles for JS animation
        div.style.opacity = '0';
        div.style.transform = 'translateY(20px)';
        div.style.maxHeight = '0';
        div.style.marginBottom = '0';
        div.style.padding = '0 20px';
        div.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';

        this.container.appendChild(div);

        // Force reflow
        void div.offsetWidth;

        // Animate in
        requestAnimationFrame(() => {
            div.style.opacity = '1';
            div.style.transform = 'translateY(0)';
            div.style.maxHeight = '100px';
            div.style.marginBottom = '10px';
            div.style.padding = '10px 20px';
        });

        // Schedule removal
        setTimeout(() => {
            this.hide(div);
        }, 3000);
    }

    hide(div) {
        if (!div.parentElement) return;

        // Animate out
        div.style.opacity = '0';
        div.style.transform = 'translateY(-20px)';
        div.style.maxHeight = '0';
        div.style.marginBottom = '0';
        div.style.padding = '0 20px';

        // Remove after transition
        setTimeout(() => {
            if (div.parentElement) div.remove();
        }, 400); // Match transition duration
    }
}
