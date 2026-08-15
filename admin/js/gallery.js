// Gallery management functions for admin panel

function addPhoto() {
    const photoUrl = document.getElementById('photoUrl')?.value.trim();
    const photoDesc = document.getElementById('photoDesc')?.value.trim();

    if (!photoUrl) {
        alert('Lütfen bir URL girin!');
        return;
    }

    let gallery = JSON.parse(localStorage.getItem('adminGallery') || '[]');
    gallery.push({
        id: Date.now(),
        url: photoUrl,
        desc: photoDesc,
        type: 'url'
    });

    localStorage.setItem('adminGallery', JSON.stringify(gallery));
    
    // Temizle
    document.getElementById('photoUrl').value = '';
    document.getElementById('photoDesc').value = '';

    // Listeyi güncelle
    loadGallery();

    // Başarı mesajı
    const msg = document.getElementById('successMsg');
    if (msg) {
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 3000);
    }
}

function loadGallery() {
    const galleryContainer = document.getElementById('galleryContainer');
    if (!galleryContainer) return;

    const gallery = JSON.parse(localStorage.getItem('adminGallery') || '[]');
    galleryContainer.innerHTML = '';

    if (gallery.length === 0) {
        galleryContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #b9afb2;">Henüz fotoğraf eklenmemiş</p>';
        return;
    }

    gallery.reverse().forEach(photo => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <img src="${photo.url}" alt="Galeri fotoğrafı" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23333%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2216%22%3EResim Yüklenemedi%3C/text%3E%3C/svg%3E'">
            <div class="gallery-item-info">
                ${photo.desc ? `<p>${photo.desc}</p>` : ''}
                <div class="gallery-item-actions">
                    <button class="copy-btn" onclick="copyURL('${photo.url}')">📋 URL</button>
                    <button class="delete-btn" onclick="deletePhoto(${photo.id})">🗑️ Sil</button>
                </div>
            </div>
        `;
        galleryContainer.appendChild(div);
    });

    // Fotoğraf sayısını güncelle
    const photoCount = document.getElementById('photoCount');
    if (photoCount) {
        photoCount.textContent = gallery.length;
    }
}

function deletePhoto(id) {
    if (confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) {
        let gallery = JSON.parse(localStorage.getItem('adminGallery') || '[]');
        gallery = gallery.filter(p => p.id !== id);
        localStorage.setItem('adminGallery', JSON.stringify(gallery));
        loadGallery();
    }
}

function copyURL(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('URL kopyalandı!');
    });
}

// Sayfa yüklendiğinde galeriyi göster
document.addEventListener('DOMContentLoaded', loadGallery);
