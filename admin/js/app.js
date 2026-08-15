const DEFAULT_ADMIN_USERNAME = 'erayrn';
const DEFAULT_ADMIN_PASSWORD = 'erayrn321';
const AUTH_TOKEN_KEY = 'admin_token_erayrn';
const AUTH_CONFIG_KEY = 'adminAuthConfig';
const ACTIVITY_KEY = 'adminActivity';
const SETTINGS_KEY = 'adminSettings';

const AdminApp = {
    keys: {
        gallery: 'adminGallery',
        content: 'adminContent',
        contact: 'adminContact',
        settings: SETTINGS_KEY
    },

    getCredentials() {
        const saved = this.getStorage(AUTH_CONFIG_KEY, null);
        return {
            username: saved?.username || DEFAULT_ADMIN_USERNAME,
            password: saved?.password || DEFAULT_ADMIN_PASSWORD
        };
    },

    checkAuth() {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const path = window.location.pathname;
        const isLoginPage = /\/admin\/(index\.html)?$/.test(path);

        if (!token && !isLoginPage) {
            window.location.href = path.includes('/pages/') ? '../index.html' : 'index.html';
        }
        if (token && isLoginPage) {
            window.location.href = 'dashboard.html';
        }
    },

    initLoginForm() {
        this.checkAuth();
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username')?.value.trim();
            const password = document.getElementById('password')?.value;
            const errorEl = document.getElementById('errorMessage');
            const button = form.querySelector('button[type="submit"]');
            const credentials = this.getCredentials();

            if (username === credentials.username && password === credentials.password) {
                button.disabled = true;
                button.textContent = 'Giriş Yapılıyor...';
                localStorage.setItem(AUTH_TOKEN_KEY, `authenticated_${Date.now()}`);
                window.location.href = 'dashboard.html';
                return;
            }

            if (errorEl) {
                errorEl.textContent = 'Kullanıcı adı veya şifre yanlış';
                errorEl.style.display = 'block';
            }
        });
    },

    initLayout() {
        this.checkAuth();
        this.applyTheme();

        const userEl = document.getElementById('username');
        if (userEl) {
            userEl.textContent = this.getCredentials().username;
        }

        const logout = document.getElementById('logoutBtn');
        if (logout) logout.addEventListener('click', () => this.logout());

        const toggle = document.querySelector('[data-sidebar-toggle]');
        if (toggle) {
            toggle.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-collapsed');
            });
        }

        const current = window.location.pathname.split('/').pop();
        document.querySelectorAll('[data-nav-link]').forEach((link) => {
            const href = link.getAttribute('href') || '';
            link.classList.toggle('active', href.endsWith(current));
        });

        const storageListener = () => {
            this.renderDashboardStats();
        };

        window.addEventListener('storage', storageListener);
        window.addEventListener('admin:data-updated', storageListener);
    },

    getStorage(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? fallback;
        } catch {
            return fallback;
        }
    },

    setStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new CustomEvent('admin:data-updated', { detail: { key } }));
    },

    addActivity(message) {
        const existing = this.getStorage(ACTIVITY_KEY, []);
        existing.unshift({
            message,
            time: new Date().toLocaleString('tr-TR')
        });

        this.setStorage(ACTIVITY_KEY, existing.slice(0, 10));
        this.updateLastSync();
    },

    updateLastSync() {
        const now = new Date().toLocaleString('tr-TR');
        const label = document.getElementById('lastSyncLabel');
        if (label) label.textContent = `Son güncelleme: ${now}`;
    },

    renderDashboardStats() {
        const photos = this.getStorage(this.keys.gallery, []).length;
        const content = this.getStorage(this.keys.content, {});
        const activities = this.getStorage(ACTIVITY_KEY, []);

        const statPhotos = document.getElementById('statPhotos');
        if (statPhotos) statPhotos.textContent = photos;

        const statVisitors = document.getElementById('statVisitors');
        if (statVisitors) {
            const seeded = 1200 + photos * 7 + (content.siteTitle ? 15 : 0);
            statVisitors.textContent = seeded.toLocaleString('tr-TR');
        }

        const statUpdated = document.getElementById('statUpdated');
        if (statUpdated) statUpdated.textContent = activities[0]?.time || 'Henüz yok';

        const list = document.getElementById('recentActivity');
        if (list) {
            list.innerHTML = '';
            if (!activities.length) {
                const li = document.createElement('li');
                li.className = 'activity-empty';
                li.textContent = 'Henüz aktivite bulunmuyor.';
                list.appendChild(li);
            } else {
                activities.forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = `${item.message} • ${item.time}`;
                    list.appendChild(li);
                });
            }
        }

        this.updateLastSync();
    },

    validateForm(form) {
        const requiredInputs = Array.from(form.querySelectorAll('[required]'));
        const invalid = requiredInputs.find((input) => !String(input.value || '').trim());
        if (invalid) {
            invalid.focus();
            this.showToast('Lütfen zorunlu alanları doldurun.', 'error');
            return false;
        }

        const emailInputs = Array.from(form.querySelectorAll('input[type="email"]'));
        const invalidEmail = emailInputs.find((input) => input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
        if (invalidEmail) {
            invalidEmail.focus();
            this.showToast('E-posta formatı geçersiz.', 'error');
            return false;
        }

        return true;
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('globalToast');
        if (!toast) {
            alert(message);
            return;
        }

        toast.textContent = message;
        toast.style.borderColor = type === 'error' ? 'rgba(226,15,39,.75)' : 'rgba(216,178,106,.65)';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2200);
    },

    async fakeFetch(payload) {
        const response = await fetch(`data:application/json,${encodeURIComponent(JSON.stringify(payload))}`);
        return response.ok;
    },

    exportBackup() {
        const payload = {
            exportedAt: new Date().toISOString(),
            gallery: this.getStorage(this.keys.gallery, []),
            content: this.getStorage(this.keys.content, {}),
            contact: this.getStorage(this.keys.contact, {}),
            settings: this.getStorage(this.keys.settings, {})
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'karanlik-hat-backup.json';
        link.click();
        URL.revokeObjectURL(link.href);
        this.addActivity('Yedek dışa aktarıldı');
        this.showToast('Yedek dosyası indirildi.');
    },

    async importBackup(file) {
        const text = await file.text();
        const parsed = JSON.parse(text);

        this.setStorage(this.keys.gallery, parsed.gallery || []);
        this.setStorage(this.keys.content, parsed.content || {});
        this.setStorage(this.keys.contact, parsed.contact || {});
        this.setStorage(this.keys.settings, parsed.settings || {});
        this.applyTheme();
        this.addActivity('Yedek içe aktarıldı');
        this.showToast('Yedek başarıyla geri yüklendi.');
    },

    updatePassword(newPassword) {
        const credentials = this.getCredentials();
        this.setStorage(AUTH_CONFIG_KEY, {
            username: credentials.username,
            password: newPassword
        });
        this.addActivity('Admin şifresi güncellendi');
    },

    applyTheme() {
        const settings = this.getStorage(this.keys.settings, {});
        document.body.classList.toggle('light-theme', settings.theme === 'light');
    },

    logout() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
    }
};

window.AdminApp = AdminApp;
window.logout = () => AdminApp.logout();
window.goToPage = (page) => { window.location.href = page; };
window.syncData = () => {
    window.dispatchEvent(new CustomEvent('admin:data-updated'));
    window.parent?.postMessage?.({ type: 'adminUpdate' }, '*');
};
window.addEventListener('message', (event) => {
    if (event?.data?.type !== 'requestAdminData') return;
    const adminData = {
        contact: AdminApp.getStorage(AdminApp.keys.contact, {}),
        content: AdminApp.getStorage(AdminApp.keys.content, {}),
        gallery: AdminApp.getStorage(AdminApp.keys.gallery, [])
    };
    event.source?.postMessage?.({ type: 'adminData', data: adminData }, '*');
});

document.addEventListener('DOMContentLoaded', () => {
    AdminApp.initLoginForm();
});
