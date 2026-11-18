/**
 * CBT Assistant AI — Authentication & Session Management
 * Manages Argon2id-authenticated sessions, JWT access & refresh tokens,
 * user profiles, and seamless guest/account synchronization.
 */

(function () {
    'use strict';

    const TOKEN_KEY = 'cbt_access_token';
    const REFRESH_KEY = 'cbt_refresh_token';
    const USER_KEY = 'cbt_user_profile';

    let currentUser = null;

    function getAccessToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function getRefreshToken() {
        return localStorage.getItem(REFRESH_KEY);
    }

    function getStoredUser() {
        try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function getAuthHeaders(headers = {}) {
        const token = getAccessToken();
        const res = { ...headers };
        if (token) {
            res['Authorization'] = `Bearer ${token}`;
        }
        return res;
    }

    async function login(email, password) {
        const resp = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await resp.json();
        if (!resp.ok) {
            throw new Error(data.error || data.detail || 'Login failed');
        }

        localStorage.setItem(TOKEN_KEY, data.access_token);
        localStorage.setItem(REFRESH_KEY, data.refresh_token);
        currentUser = {
            id: data.user_id,
            email: data.email,
            full_name: data.full_name,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        updateAuthUI();
        return currentUser;
    }

    async function register(email, password, full_name) {
        const resp = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, full_name }),
        });
        const data = await resp.json();
        if (!resp.ok) {
            throw new Error(data.error || data.detail || 'Registration failed');
        }

        localStorage.setItem(TOKEN_KEY, data.access_token);
        localStorage.setItem(REFRESH_KEY, data.refresh_token);
        currentUser = {
            id: data.user_id,
            email: data.email,
            full_name: data.full_name,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        updateAuthUI();
        return currentUser;
    }

    async function logout() {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            try {
                await fetch('/api/v1/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });
            } catch (e) {
                console.debug('Logout request failed:', e);
            }
        }
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
        currentUser = null;
        updateAuthUI();
    }

    async function checkAuth() {
        currentUser = getStoredUser();
        const token = getAccessToken();
        if (!token) {
            updateAuthUI();
            return null;
        }

        try {
            const resp = await fetch('/api/v1/auth/me', {
                headers: getAuthHeaders(),
            });
            if (resp.ok) {
                currentUser = await resp.json();
                localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
            } else if (resp.status === 401) {
                // Try refresh token
                const refreshed = await tryRefreshToken();
                if (!refreshed) {
                    await logout();
                }
            }
        } catch {
            // Keep stored profile offline
        }

        updateAuthUI();
        return currentUser;
    }

    async function tryRefreshToken() {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return false;

        try {
            const resp = await fetch('/api/v1/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });
            if (resp.ok) {
                const data = await resp.json();
                localStorage.setItem(TOKEN_KEY, data.access_token);
                localStorage.setItem(REFRESH_KEY, data.refresh_token);
                return true;
            }
        } catch {
            return false;
        }
        return false;
    }

    function updateAuthUI() {
        const userBtn = document.getElementById('authHeaderBtn');
        const userText = document.getElementById('authHeaderText');
        const userAvatar = document.getElementById('authHeaderAvatar');

        if (!userBtn) return;

        if (currentUser && currentUser.email) {
            const displayName = currentUser.full_name || currentUser.email.split('@')[0];
            if (userText) userText.textContent = displayName;
            if (userAvatar) userAvatar.textContent = (displayName[0] || 'U').toUpperCase();
            userBtn.title = `Signed in as ${currentUser.email}`;
            userBtn.classList.add('logged-in');
        } else {
            if (userText) userText.textContent = 'Sign In';
            if (userAvatar) userAvatar.innerHTML = '<i data-lucide="user" style="width:14px; height:14px;"></i>';
            userBtn.title = 'Sign In or Register';
            userBtn.classList.remove('logged-in');
        }
        if (window.lucide) window.lucide.createIcons();
    }

    // Modal UI Handlers
    window.openAuthModal = function (tab = null) {
        const modal = document.getElementById('authModal');
        if (!modal) return;
        
        if (!tab) {
            tab = (currentUser && currentUser.email) ? 'account' : 'login';
        }

        switchAuthTab(tab);
        modal.style.display = 'flex';
        modal.classList.add('active');
        if (window.location.hash !== '#/login' && window.location.hash !== '#/register') {
            window.location.hash = tab === 'register' ? '#/register' : '#/login';
        }
        if (window.lucide) window.lucide.createIcons();
    };

    window.closeAuthModal = function () {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
        }
        if (window.location.hash === '#/login' || window.location.hash === '#/register' || window.location.hash === '#/auth') {
            window.location.hash = '#/';
        }
    };

    window.switchAuthTab = function (tab) {
        const loginForm = document.getElementById('authLoginForm');
        const regForm = document.getElementById('authRegisterForm');
        const accountView = document.getElementById('authAccountView');
        const tabBar = document.getElementById('authTabBar');
        const tabLogin = document.getElementById('tabAuthLogin');
        const tabReg = document.getElementById('tabAuthRegister');
        const modalTitle = document.getElementById('authModalTitle');
        const errBanner = document.getElementById('authErrorBanner');
        if (errBanner) errBanner.style.display = 'none';

        if (tab === 'account' && currentUser) {
            if (tabBar) tabBar.style.display = 'none';
            if (loginForm) loginForm.style.display = 'none';
            if (regForm) regForm.style.display = 'none';
            if (accountView) accountView.style.display = 'block';
            if (modalTitle) modalTitle.textContent = 'Account & Privacy';

            const nameEl = document.getElementById('accountNameLabel');
            const emailEl = document.getElementById('accountEmailLabel');
            const badgeEl = document.getElementById('accountAvatarBadge');
            const displayName = currentUser.full_name || currentUser.email.split('@')[0];
            if (nameEl) nameEl.textContent = displayName;
            if (emailEl) emailEl.textContent = currentUser.email;
            if (badgeEl) badgeEl.textContent = (displayName[0] || 'U').toUpperCase();
            return;
        }

        if (tabBar) tabBar.style.display = 'flex';
        if (accountView) accountView.style.display = 'none';
        if (modalTitle) modalTitle.textContent = 'Welcome to CBT Assistant';

        if (tab === 'register') {
            if (loginForm) loginForm.style.display = 'none';
            if (regForm) regForm.style.display = 'block';
            if (tabLogin) tabLogin.classList.remove('active');
            if (tabReg) tabReg.classList.add('active');
        } else {
            if (loginForm) loginForm.style.display = 'block';
            if (regForm) regForm.style.display = 'none';
            if (tabLogin) tabLogin.classList.add('active');
            if (tabReg) tabReg.classList.remove('active');
        }
        if (window.lucide) window.lucide.createIcons();
    };

    window.handleLoginSubmit = async function (e) {
        if (e) e.preventDefault();
        const emailEl = document.getElementById('loginEmail');
        const passEl = document.getElementById('loginPassword');
        const errBanner = document.getElementById('authErrorBanner');
        const btn = document.getElementById('btnLoginSubmit');

        const email = emailEl ? emailEl.value.trim() : '';
        const password = passEl ? passEl.value : '';

        if (!email || !password) {
            showAuthError('Please enter both email and password.');
            return;
        }

        try {
            if (btn) { btn.disabled = true; btn.textContent = 'Signing In...'; }
            await login(email, password);
            window.closeAuthModal();
        } catch (err) {
            showAuthError(err.message);
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
        }
    };

    window.handleRegisterSubmit = async function (e) {
        if (e) e.preventDefault();
        const nameEl = document.getElementById('regName');
        const emailEl = document.getElementById('regEmail');
        const passEl = document.getElementById('regPassword');
        const btn = document.getElementById('btnRegSubmit');

        const name = nameEl ? nameEl.value.trim() : '';
        const email = emailEl ? emailEl.value.trim() : '';
        const password = passEl ? passEl.value : '';

        if (!email || !password) {
            showAuthError('Email and password are required.');
            return;
        }
        if (password.length < 8) {
            showAuthError('Password must be at least 8 characters.');
            return;
        }

        try {
            if (btn) { btn.disabled = true; btn.textContent = 'Creating Account...'; }
            await register(email, password, name);
            window.closeAuthModal();
        } catch (err) {
            showAuthError(err.message);
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }
        }
    };

    function showAuthError(msg) {
        const errBanner = document.getElementById('authErrorBanner');
        if (errBanner) {
            errBanner.textContent = msg;
            errBanner.style.display = 'block';
        }
    }

    window.handleUserLogout = async function () {
        await logout();
        window.closeAuthModal();
    };

    // Public API
    window.cbtAuth = {
        login,
        register,
        logout,
        checkAuth,
        getUser: () => currentUser,
        getToken: getAccessToken,
        getHeaders: getAuthHeaders,
    };

    // Initialize check on boot
    document.addEventListener('DOMContentLoaded', () => {
        checkAuth();
    });
})();
