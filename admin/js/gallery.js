// Gallery Management
const GALLERY_KEY = 'adminGallery';

function loadGallery() {
    const container = document.getElementById('galleryContainer');
    const gallery = JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
    
    container.innerHTML = '';
    
    if (gallery.length === 0) {
        container.innerHTML = '<p style="color: rgba(247, 243, 244, 0.6); text-align: center; padding: 20px;">Henüz fotoğraf eklenmemiş</p>';
        return;
    }
    
    gallery.forEach((photo, index) => {
        const photoEl = document.createElement('div');
        photoEl.className = 'gallery-item';
        photoEl.innerHTML = `
            <div class="gallery-item-info">
                <div class="gallery-item-url">${photo.url}</div>
                ${photo.desc ? `<div class="gallery-item-desc">${photo.desc}</div>` : ''}
            </div>
            <button class="delete-btn" onclick="deletePhoto(${index})">Sil</button>
        `;
        container.appendChild(photoEl);
    });
}

function addPhoto() {
    const urlInput = document.getElementById('photoUrl');
    const descInput = document.getElementById('photoDesc');
    const url = urlInput.value.trim();
    const desc = descInput.value.trim();
    
    if (!url) {
        alert('Lütfen fotoğraf URL\'sini girin');
        return;
    }
    
    const gallery = JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
    gallery.push({ url, desc });
    localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
    
    // Siteye bildir
    syncData();
    
    urlInput.value = '';
    descInput.value = '';
    loadGallery();
    alert('Fotoğraf başarıyla eklendi!');
}

function deletePhoto(index) {
    if (confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) {
        const gallery = JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
        gallery.splice(index, 1);
        localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
        
        // Siteye bildir
        syncData();
        
        loadGallery();
        alert('Fotoğraf silindi!');
    }
}

// Sayfa yüklendiğinde galeryi yükle
document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
});