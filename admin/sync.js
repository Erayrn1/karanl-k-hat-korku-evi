// Admin Sync - Ana site ile localStorage senkronizasyonu

function loadAdminData() {
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    return {
        gallery: adminData.gallery || [],
        content: adminData.content || {},
        contact: adminData.contact || {}
    };
}

function updateSiteContent() {
    const data = loadAdminData();
    
    // Galeri güncelleme
    if (data.gallery && data.gallery.length > 0) {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
            galleryGrid.innerHTML = '';
            data.gallery.forEach(photo => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'gallery-item';
                button.setAttribute('data-src', photo.url);
                
                const img = document.createElement('img');
                img.src = photo.url;
                img.alt = photo.desc || 'Galeri fotoğrafı';
                img.loading = 'lazy';
                
                button.appendChild(img);
                button.addEventListener('click', () => openLightbox(photo.url));
                galleryGrid.appendChild(button);
            });
        }
    }
    
    // İçerik güncelleme
    if (data.content.siteTitle) {
        const titleElements = document.querySelectorAll('[data-admin-title]');
        titleElements.forEach(el => {
            if (el.querySelector('span')) {
                el.innerHTML = data.content.siteTitle.replace('HAT', '<span>HAT</span>');
            } else {
                el.textContent = data.content.siteTitle;
            }
        });
    }
    
    if (data.content.mainSlogan) {
        const sloganElements = document.querySelectorAll('[data-admin-slogan]');
        sloganElements.forEach(el => {
            el.textContent = data.content.mainSlogan;
        });
    }
    
    // İletişim güncelleme
    if (data.contact.phone) {
        const phoneElements = document.querySelectorAll('[data-admin-phone]');
        phoneElements.forEach(el => {
            el.textContent = data.contact.phone;
            if (el.tagName === 'A') el.href = 'tel:' + data.contact.phone;
        });
    }
    
    if (data.contact.address) {
        const addressElements = document.querySelectorAll('[data-admin-address]');
        addressElements.forEach(el => {
            el.textContent = data.contact.address;
        });
    }
}

// Sayfa yüklendiğinde veriyi güncelle
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateSiteContent);
} else {
    updateSiteContent();
}

// localStorage değişikliklerini dinle
window.addEventListener('storage', function(e) {
    if (e.key === 'adminData') {
        updateSiteContent();
    }
});

// Her 2 saniyede bir kontrol et
setInterval(updateSiteContent, 2000);
