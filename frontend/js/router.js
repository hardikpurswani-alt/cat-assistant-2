/**
 * CBT Assistant AI — Client-Side SPA Router & Navigation Controller
 * Handles deep-linking, browser history (back/forward), URL hashes,
 * direct page loading, and active sidebar/menu indicators.
 */

(function () {
    'use strict';

    const ROUTE_MAP = {
        '/': { modal: null, title: 'CBT Assistant — AI Mental Health Platform' },
        '/chat': { modal: null, title: 'CBT Assistant — AI Mental Health Platform' },
        '/mood': { modal: 'moodModal', fn: () => window.openModal && window.openModal('moodModal', false), title: 'Mood Check-in' },
        '/dashboard': { modal: 'dashModal', fn: () => window.openDashboard && window.openDashboard(), title: 'Progress Dashboard' },
        '/thoughts': { modal: 'histModal', fn: () => window.openThoughtHistoryModal && window.openThoughtHistoryModal(), title: 'Thought Diary' },
        '/thoughts/new': { modal: 'thoughtModal', fn: () => window.openThoughtModalSection && window.openThoughtModalSection('thought'), title: 'New Thought Entry' },
        '/sleep': { modal: 'sleepHistModal', fn: () => window.openSleepHistoryModal && window.openSleepHistoryModal(), title: 'Sleep Journal' },
        '/sleep/new': { modal: 'sleepModal', fn: () => window.openSleepEntryModal && window.openSleepEntryModal(), title: 'Log Sleep' },
        '/assessment': { modal: 'testsMenuModal', fn: () => window.openModal && window.openModal('testsMenuModal', false), title: 'Clinical Self-Assessment' },
        '/assessment/phq9': { modal: 'phqModal', fn: () => window.openModal && window.openModal('phqModal', false), title: 'PHQ-9 Depression Screen' },
        '/assessment/gad7': { modal: 'gadModal', fn: () => window.openModal && window.openModal('gadModal', false), title: 'GAD-7 Anxiety Screen' },
        '/assessment/esteem': { modal: 'esteemModal', fn: () => window.openModal && window.openModal('esteemModal', false), title: 'Rosenberg Self-Esteem' },
        '/calendar': { modal: 'calModal', fn: () => window.openCalendar && window.openCalendar(), title: 'Records Calendar' },
        '/articles': { modal: 'articleModal', fn: () => window.openArticleLibrary && window.openArticleLibrary(), title: 'Article Library' },
        '/videos': { modal: 'videoModal', fn: () => window.openVideoLibrary && window.openVideoLibrary(), title: 'Video Library' },
        '/sos': { modal: 'sosModal', fn: () => window.openModal && window.openModal('sosModal', false), title: 'Emergency Grounding (SOS)' },
        '/settings': { modal: 'notifModal', fn: () => window.openNotifModal && window.openNotifModal(), title: 'Settings' },
        '/download': { modal: 'downloadModal', fn: () => window.openModal && window.openModal('downloadModal', false), title: 'Download Summary' },
        '/login': { modal: 'authModal', fn: () => window.openAuthModal && window.openAuthModal('login'), title: 'Sign In' },
        '/register': { modal: 'authModal', fn: () => window.openAuthModal && window.openAuthModal('register'), title: 'Create Account' }
    };

    // Modal ID to Route reverse lookup
    const MODAL_TO_ROUTE = {
        'authModal': '/login',
        'moodModal': '/mood',
        'dashModal': '/dashboard',
        'histModal': '/thoughts',
        'thoughtModal': '/thoughts/new',
        'sleepHistModal': '/sleep',
        'sleepModal': '/sleep/new',
        'testsMenuModal': '/assessment',
        'phqModal': '/assessment/phq9',
        'gadModal': '/assessment/gad7',
        'esteemModal': '/assessment/esteem',
        'calModal': '/calendar',
        'articleModal': '/articles',
        'videoModal': '/videos',
        'sosModal': '/sos',
        'notifModal': '/settings',
        'downloadModal': '/download'
    };

    let isNavigating = false;

    function getNormalizedHash() {
        let hash = window.location.hash || '';
        if (hash.startsWith('#')) hash = hash.slice(1);
        if (!hash.startsWith('/')) hash = '/' + hash;
        if (hash.length > 1 && hash.endsWith('/')) hash = hash.slice(0, -1);
        return hash || '/';
    }

    function updateActiveSidebar(route) {
        const buttons = document.querySelectorAll('.sidebar-btn');
        buttons.forEach(btn => btn.classList.remove('active'));

        const targetModal = ROUTE_MAP[route]?.modal;
        if (!targetModal) {
            // Main conversation route
            const newChatBtn = document.querySelector('.sidebar-btn[onclick*="startNewChat"]');
            if (newChatBtn) newChatBtn.classList.add('active');
            return;
        }

        // Match button with route's modal
        buttons.forEach(btn => {
            const oc = btn.getAttribute('onclick') || '';
            if (
                (route.startsWith('/thoughts') && oc.includes('Thought')) ||
                (route.startsWith('/sleep') && oc.includes('Sleep')) ||
                (route.startsWith('/assessment') && oc.includes('testsMenuModal')) ||
                (route === '/calendar' && oc.includes('Calendar')) ||
                (route === '/dashboard' && oc.includes('Dashboard')) ||
                (route === '/articles' && oc.includes('Article')) ||
                (route === '/videos' && oc.includes('Video')) ||
                (route === '/settings' && oc.includes('Notif')) ||
                (route === '/download' && oc.includes('downloadModal'))
            ) {
                btn.classList.add('active');
            }
        });
    }

    function closeAllModalsDirect() {
        document.querySelectorAll('.modal-overlay').forEach(el => {
            el.classList.remove('active');
            el.style.display = 'none';
        });
        document.querySelectorAll('.pmr-overlay, .stop-overlay, .ground-overlay, .breathe-overlay').forEach(el => {
            el.style.display = 'none';
        });
        // Stop SOS ambient audio if playing
        if (window.stopSosAmbientSound) window.stopSosAmbientSound();
        if (window.stopBreathing) window.stopBreathing();
    }

    function handleRoute() {
        if (isNavigating) return;
        isNavigating = true;

        try {
            const route = getNormalizedHash();
            const config = ROUTE_MAP[route];

            updateActiveSidebar(route);

            if (!config || !config.modal) {
                // Route is home/chat
                closeAllModalsDirect();
                document.title = 'CBT Assistant — AI Mental Health Platform';
                // Close mobile sidebar drawer if open
                if (window.closeMobileSidebar) window.closeMobileSidebar();
                return;
            }

            // Route requires a modal
            document.title = config.title + ' — CBT Assistant';
            closeAllModalsDirect();

            const modalEl = document.getElementById(config.modal);
            if (modalEl) {
                modalEl.classList.add('active');
            }

            if (typeof config.fn === 'function') {
                config.fn();
            }

            if (window.lucide) window.lucide.createIcons();
            if (window.closeMobileSidebar) window.closeMobileSidebar();
        } finally {
            isNavigating = false;
        }
    }

    function navigateTo(path) {
        let clean = path || '/';
        if (!clean.startsWith('/')) clean = '/' + clean;
        window.location.hash = '#' + clean;
    }

    // Intercept existing openModal / closeModal functions seamlessly
    function hookExistingModals() {
        const origOpenModal = window.openModal;
        window.openModal = function (id, syncHash = true) {
            if (origOpenModal) origOpenModal(id);
            if (syncHash !== false) {
                const route = MODAL_TO_ROUTE[id];
                if (route && getNormalizedHash() !== route) {
                    window.location.hash = '#' + route;
                }
            }
        };

        const origCloseModal = window.closeModal;
        window.closeModal = function (id) {
            if (origCloseModal) origCloseModal(id);
            const currentRoute = getNormalizedHash();
            const modalRoute = MODAL_TO_ROUTE[id];
            if (modalRoute && currentRoute === modalRoute) {
                window.location.hash = '#/';
            }
        };

        // Specific custom modal openers
        const origOpenDashboard = window.openDashboard;
        window.openDashboard = function () {
            if (origOpenDashboard) origOpenDashboard();
            if (getNormalizedHash() !== '/dashboard') {
                window.location.hash = '#/dashboard';
            }
        };

        const origOpenCalendar = window.openCalendar;
        window.openCalendar = function () {
            if (origOpenCalendar) origOpenCalendar();
            if (getNormalizedHash() !== '/calendar') {
                window.location.hash = '#/calendar';
            }
        };

        const origOpenArticleLibrary = window.openArticleLibrary;
        window.openArticleLibrary = function () {
            if (origOpenArticleLibrary) origOpenArticleLibrary();
            if (getNormalizedHash() !== '/articles') {
                window.location.hash = '#/articles';
            }
        };

        const origOpenVideoLibrary = window.openVideoLibrary;
        window.openVideoLibrary = function () {
            if (origOpenVideoLibrary) origOpenVideoLibrary();
            if (getNormalizedHash() !== '/videos') {
                window.location.hash = '#/videos';
            }
        };

        const origOpenNotifModal = window.openNotifModal;
        window.openNotifModal = function () {
            if (origOpenNotifModal) origOpenNotifModal();
            if (getNormalizedHash() !== '/settings') {
                window.location.hash = '#/settings';
            }
        };

        const origOpenThoughtHistoryModal = window.openThoughtHistoryModal;
        window.openThoughtHistoryModal = function () {
            if (origOpenThoughtHistoryModal) origOpenThoughtHistoryModal();
            if (getNormalizedHash() !== '/thoughts') {
                window.location.hash = '#/thoughts';
            }
        };

        const origOpenSleepHistoryModal = window.openSleepHistoryModal;
        window.openSleepHistoryModal = function () {
            if (origOpenSleepHistoryModal) origOpenSleepHistoryModal();
            if (getNormalizedHash() !== '/sleep') {
                window.location.hash = '#/sleep';
            }
        };
    }

    // Mobile sidebar toggle controller
    window.toggleMobileSidebar = function () {
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (!sidebar) return;
        const isOpen = sidebar.classList.toggle('drawer-open');
        if (backdrop) backdrop.classList.toggle('active', isOpen);
    };

    window.closeMobileSidebar = function () {
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar) sidebar.classList.remove('drawer-open');
        if (backdrop) backdrop.classList.remove('active');
    };

    // Global navigation API
    window.router = {
        navigate: navigateTo,
        getCurrentRoute: getNormalizedHash
    };

    // Listen to hash changes and initial load
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('DOMContentLoaded', () => {
        hookExistingModals();
        setTimeout(handleRoute, 60);
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeAllModalsDirect();
                window.location.hash = '#/';
            }
        }
    });
})();
