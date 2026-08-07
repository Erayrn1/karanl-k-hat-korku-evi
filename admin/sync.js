// Admin Sync - Ana site ile localStorage senkronizasyonu

function loadAdminData() {
    // İletişim bilgilerini yükle
    const contactData = JSON.parse(localStorage.getItem('adminContact') || '{}');
    
    // İçerik verilerini yükle
    const contentData = JSON.parse(localStorage.getItem('adminContent') || '{}');
    
    // Galeri verilerini yükle
    const galleryData = JSON.parse(localStorage.getItem('adminGallery') || '[]');
    
    return {
        contact: contactData,
        content: contentData,
        gallery: galleryData
    };
}

function updateSiteContent() {
    const data = loadAdminData();
    
    // İletişim bilgilerini güncelle
    if (data.contact.phone) {
        const phoneElements = document.querySelectorAll('[data-admin-phone]');
        phoneElements.forEach(el => {
            el.textContent = data.contact.phone;
            if (el.tagName === 'A') el.href = 'tel:' + data.contact.phone;
        });
    }
    
    if (data.contact.email) {
        const emailElements = document.querySelectorAll('[data-admin-email]');
        emailElements.forEach(el => {
            el.textContent = data.contact.email;
            if (el.tagName === 'A') el.href = 'mailto:' + data.contact.email;
        });
    }
    
    if (data.contact.address) {
        const addressElements = document.querySelectorAll('[data-admin-address]');
        addressElements.forEach(el => {
            el.textContent = data.contact.address;
        });
    }
    
    // İçerik verilerini güncelle
    if (data.content.siteTitle) {
        const titleElements = document.querySelectorAll('[data-admin-title]');
        titleElements.forEach(el => {
            el.textContent = data.content.siteTitle;
        });
    }
    
    if (data.content.mainSlogan) {
        const sloganElements = document.querySelectorAll('[data-admin-slogan]');
        sloganElements.forEach(el => {
            el.textContent = data.content.mainSlogan;
        });
    }
    
    if (data.content.feature1) {
        const feature1 = document.querySelector('[data-admin-feature="1"]');
        if (feature1) feature1.textContent = data.content.feature1;
    }
    
    if (data.content.feature2) {
        const feature2 = document.querySelector('[data-admin-feature="2"]');
        if (feature2) feature2.textContent = data.content.feature2;
    }
    
    if (data.content.feature3) {
        const feature3 = document.querySelector('[data-admin-feature="3"]');
        if (feature3) feature3.textContent = data.content.feature3;
    }
    
    // Galeriyi güncelle
    if (data.gallery.length > 0) {
        const galleryContainer = document.querySelector('.gallery-grid');
        if (galleryContainer) {
            galleryContainer.innerHTML = '';
            data.gallery.forEach(photo => {
                const button = document.createElement('button');
                button.type = 'button';
                const img = document.createElement('img');
                img.src = photo.url;
                img.alt = photo.desc || 'Galeri fotoğrafı';
                button.appendChild(img);
                galleryContainer.appendChild(button);
            });
        }
    }
}

// Sayfa yüklendiğinde veriyi güncelle
document.addEventListener('DOMContentLoaded', updateSiteContent);

// localStorage değişikliklerini dinle (başka tapta admin değişirse)
window.addEventListener('storage', function(e) {
    if (e.key === 'adminContact' || e.key === 'adminContent' || e.key === 'adminGallery') {
        updateSiteContent();
    }
});

// Her 5 saniyede bir kontrol et (refresh etmeden güncelleme)
setInterval(updateSiteContent, 5000);