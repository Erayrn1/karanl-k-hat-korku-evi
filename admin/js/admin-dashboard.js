// Admin Dashboard JavaScript

const ADMIN_USERNAME = 'erayrn';
const ADMIN_PASSWORD = 'erayrn321';
const AUTH_TOKEN = 'admin_token_erayrn';

// Page Navigation
let currentPage = 'dashboard';
let selectedFile = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initNavigation();
    loadDashboardData();
    setupEventListeners();
});

// Authentication
function checkAuth() {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (!token && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        localStorage.removeItem(AUTH_TOKEN);
        window.location.href = 'index.html';
    }
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });
}

function navigateTo(page) {
    // Update active link
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    
    // Show selected page
    const pageElement = document.getElementById(`${page}Page`);
    if (pageElement) {
        pageElement.style.display = 'block';
    }
    
    // Update header
    const titles = {
        dashboard: 'Dashboard',
        gallery: 'Galeri Yönetimi',
        content: 'İçerik Yönetimi',
        contact: 'İletişim Bilgileri',
        settings: 'Sistem Ayarları'
    };
    
    document.getElementById('pageTitle').textContent = titles[page];
    document.getElementById('breadcrumb').innerHTML = `<a href="#">Ana Sayfa</a> / <span>${titles[page]}</span>`;
    
    currentPage = page;
    
    // Load page-specific data
    if (page === 'gallery') loadGallery();
    if (page === 'content') loadContentForm();
    if (page === 'contact') loadContactForm();
}

// Dashboard
function loadDashboardData() {
    const gallery = JSON.parse(localStorage.getItem('adminGallery') || '[]');
    const content = JSON.parse(localStorage.getItem('adminContent') || '{}');
    const contact = JSON.parse(localStorage.getItem('adminContact') || '{}');
    
    document.getElementById('photoCount').textContent = gallery.length;
    document.getElementById('contentCount').textContent = Object.keys(content).length;
    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('tr-TR');
    
    // Calculate storage
    const storageSize = JSON.stringify(localStorage).length;
    const storageMB = (storageSize / 1024).toFixed(2);
    document.getElementById('storageUsed').textContent = storageMB + ' KB';
    
    // Last activity
    const lastActivity = localStorage.getItem('lastActivity') || 'İçerik henüz güncellenmemiş';
    document.getElementById('lastActivity').textContent = lastActivity;
}

// Alert System
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideInDown .3s ease reverse';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// File Upload Handler
function setupEventListeners() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.background = 'rgba(226, 15, 39, .25)';
            dropZone.style.borderColor = '#ff3650';
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.background = 'var(--panel-light)';
            dropZone.style.borderColor = 'var(--red)';
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.background = 'var(--panel-light)';
            dropZone.style.borderColor = 'var(--red)';
            const files = e.dataTransfer.files;
            if (files.length > 0) handleFileSelect(files[0]);
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFileSelect(e.target.files[0]);
        });
    }
    
    // Content Form
    const contentForm = document.getElementById('contentForm');
    if (contentForm) {
        contentForm.addEventListener('submit', saveContent);
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', saveContact);
    }
}

function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
        showAlert('Lütfen yalnız resim dosyaları seçiniz!', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showAlert('Dosya 5MB\'dan büyük!', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        selectedFile = {
            data: e.target.result,
            name: file.name,
            size: file.size
        };
        
        document.getElementById('preview').src = selectedFile.data;
        document.getElementById('previewContainer').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function confirmUpload() {
    if (!selectedFile) return;
    
    const desc = document.getElementById('photoDesc').value;
    const gallery = JSON.parse(localStorage.getItem('adminGallery') || '[]');
    
    gallery.push({
        id: Date.now(),
        url: selectedFile.data,
        desc: desc,
        uploadedAt: new Date().toLocaleString('tr-TR'),
        size: selectedFile.size,
        name: selectedFile.name
    });
    
    localStorage.setItem('adminGallery', JSON.stringify(gallery));
    localStorage.setItem('lastActivity', `Yeni fotoğraf yüklendi: ${selectedFile.name}`);
    
    showAlert('✅ Fotoğraf başarıyla eklendi!', 'success');
    cancelUpload();
    loadGallery();
    loadDashboardData();
}

function cancelUpload() {
    selectedFile = null;
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('photoDesc').value = '';
    document.getElementById('fileInput').value = '';
}

function loadGallery() {
    const gallery = JSON.parse(localStorage.getItem('adminGallery') || '[]');
    const grid = document.getElementById('galleryGrid');
    const count = document.getElementById('galleryCount');
    
    count.textContent = gallery.length;
    grid.innerHTML = '';
    
    if (gallery.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">Henüz fotoğraf eklenmemiş</p>';
        return;
    }
    
    gallery.reverse().forEach(photo => {
        const item = document.createElement('div');
        item.style.cssText = 'position: relative; border-radius: var(--radius); overflow: hidden; background: var(--panel-light);';
        item.innerHTML = `
            <img src="${photo.url}" style="width: 100%; height: 150px; object-fit: cover;" alt="Galeri">
            <div style="position: absolute; inset: 0; background: rgba(0,0,0,.8); opacity: 0; transition: opacity .2s; display: flex; flex-direction: column; align-items: center; justify-content: center;" class="photo-overlay">
                <button class="btn btn-sm btn-primary" style="margin-bottom: 5px;" onclick="copyPhotoURL('${photo.url}')">📋 Kopyala</button>
                <button class="btn btn-sm" style="background: rgba(239, 68, 68, .2); border: 1px solid var(--error); color: var(--error);" onclick="deletePhoto(${photo.id})">🗑️ Sil</button>
            </div>
        `;
        item.addEventListener('mouseenter', () => item.querySelector('.photo-overlay').style.opacity = '1');
        item.addEventListener('mouseleave', () => item.querySelector('.photo-overlay').style.opacity = '0');
        grid.appendChild(item);
    });
}

function copyPhotoURL(url) {
    navigator.clipboard.writeText(url);
    showAlert('📋 URL kopyalandı!', 'success');
}

function deletePhoto(id) {
    if (confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) {
        let gallery = JSON.parse(localStorage.getItem('adminGallery') || '[]');
        gallery = gallery.filter(p => p.id !== id);
        localStorage.setItem('adminGallery', JSON.stringify(gallery));
        localStorage.setItem('lastActivity', 'Fotoğraf silindi');
        showAlert('🗑️ Fotoğraf silindi', 'success');
        loadGallery();
        loadDashboardData();
    }
}

// Content Management
function loadContentForm() {
    const content = JSON.parse(localStorage.getItem('adminContent') || '{}');
    
    document.getElementById('siteTitle').value = content.siteTitle || 'KARANLIK HAT';
    document.getElementById('mainSlogan').value = content.mainSlogan || 'Gerçeğin kabusa dönüştüğü yer';
    document.getElementById('aboutText').value = content.aboutText || '';
    document.getElementById('feature1').value = content.feature1 || '11 Oda';
    document.getElementById('feature2').value = content.feature2 || '1 Koridor';
    document.getElementById('feature3').value = content.feature3 || '2 Tünel Girişi';
}

function saveContent(e) {
    e.preventDefault();
    
    const content = {
        siteTitle: document.getElementById('siteTitle').value,
        mainSlogan: document.getElementById('mainSlogan').value,
        aboutText: document.getElementById('aboutText').value,
        feature1: document.getElementById('feature1').value,
        feature2: document.getElementById('feature2').value,
        feature3: document.getElementById('feature3').value
    };
    
    localStorage.setItem('adminContent', JSON.stringify(content));
    localStorage.setItem('lastActivity', 'İçerik güncellendi');
    showAlert('✅ İçerik başarıyla kaydedildi!', 'success');
    loadDashboardData();
}

function resetContentForm() {
    if (confirm('Formu sıfırlamak istediğinize emin misiniz?')) {
        loadContentForm();
    }
}

// Contact Management
function loadContactForm() {
    const contact = JSON.parse(localStorage.getItem('adminContact') || '{}');
    
    document.getElementById('phone').value = contact.phone || '+90 533 484 2521';
    document.getElementById('phone2').value = contact.phone2 || '';
    document.getElementById('email').value = contact.email || '';
    document.getElementById('whatsapp').value = contact.whatsapp || '+90 533 381 4921';
    document.getElementById('address').value = contact.address || 'Namık Kemal, 15. Sk. No:1/A D:1, 34513 Esenyurt/İstanbul';
    document.getElementById('instagram').value = contact.instagram || '@karanlikhatkorkuevi';
    document.getElementById('mapsEmbed').value = contact.mapsEmbed || '';
}

function saveContact(e) {
    e.preventDefault();
    
    const contact = {
        phone: document.getElementById('phone').value,
        phone2: document.getElementById('phone2').value,
        email: document.getElementById('email').value,
        whatsapp: document.getElementById('whatsapp').value,
        address: document.getElementById('address').value,
        instagram: document.getElementById('instagram').value,
        mapsEmbed: document.getElementById('mapsEmbed').value
    };
    
    localStorage.setItem('adminContact', JSON.stringify(contact));
    localStorage.setItem('lastActivity', 'İletişim bilgileri güncellendi');
    showAlert('✅ İletişim bilgileri başarıyla kaydedildi!', 'success');
    loadDashboardData();
}

function resetContactForm() {
    if (confirm('Formu sıfırlamak istediğinize emin misiniz?')) {
        loadContactForm();
    }
}

// Settings
function exportData() {
    const data = {
        gallery: JSON.parse(localStorage.getItem('adminGallery') || '[]'),
        content: JSON.parse(localStorage.getItem('adminContent') || '{}'),
        contact: JSON.parse(localStorage.getItem('adminContact') || '{}')
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showAlert('📥 Veriler indirildi!', 'success');
}

function clearAllData() {
    localStorage.removeItem('adminGallery');
    localStorage.removeItem('adminContent');
    localStorage.removeItem('adminContact');
    showAlert('🗑️ Tüm veriler silindi!', 'success');
    location.reload();
}

// Sync with main site
setInterval(() => {
    const data = {
        gallery: JSON.parse(localStorage.getItem('adminGallery') || '[]'),
        content: JSON.parse(localStorage.getItem('adminContent') || '{}'),
        contact: JSON.parse(localStorage.getItem('adminContact') || '{}')
    };
    localStorage.setItem('adminData', JSON.stringify(data));
}, 1000);
