document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    checkH();
    setInterval(checkH, 10000);
    updateWelcomeMsg();
    const msgInp = document.getElementById('msgInput');
    if (msgInp) {
        msgInp.addEventListener('input', function () {
            this.style.height = 'auto';
            if (this.scrollHeight > 120) {
                this.style.height = '120px';
                this.style.overflowY = 'auto';
            } else {
                this.style.height = Math.max(this.scrollHeight, 40) + 'px';
                this.style.overflowY = 'hidden';
            }
        });
    }
    syncData('/api/sync/sleep', 'sleepLog');
    syncData('/api/sync/activities', 'activities');
    syncTests();

    // Restore notification schedules
    const ns = JSON.parse(localStorage.getItem('notifSettings') || '{}');
    if (ns.morning || ns.evening) scheduleNotifications(ns);
    // Update bell icon if notifications are active
    if (ns.morning || ns.evening) {
        const bell = document.getElementById('notifSidebarBtn');
        if (bell) bell.style.color = 'var(--accent)';
    }

    // Render editorial welcome hero if empty
    if (typeof window.renderEditorialWelcome === 'function') {
        window.renderEditorialWelcome();
    }
    lucide.createIcons();
    if (typeof updateWelcomeMsg === 'function') updateWelcomeMsg();
    if (window.applyTranslations) window.applyTranslations();
    if (typeof loadChatHistory === 'function') loadChatHistory();
});
