// Gallery management – admin panel
// Handles: file selection → preview → confirm/cancel → save → list → delete

(function () {
    'use strict';

    var STORAGE_KEY = 'adminGallery';
    var MAX_SIZE = 5 * 1024 * 1024; // 5 MB

    // ── Element references ──────────────────────────────────────────────────
    var fileInput      = document.getElementById('fileInput');
    var previewArea    = document.getElementById('previewArea');
    var previewImg     = document.getElementById('previewImg');
    var previewFilename = document.getElementById('previewFilename');
    var photoDesc      = document.getElementById('photoDesc');
    var confirmBtn     = document.getElementById('confirmBtn');
    var cancelBtn      = document.getElementById('cancelBtn');
    var spinner        = document.getElementById('spinner');
    var uploadProgress = document.getElementById('uploadProgress');
    var progressFill   = document.getElementById('progressFill');
    var successMsg     = document.getElementById('successMsg');
    var errorMsg       = document.getElementById('errorMsg');
    var uploadSection  = document.getElementById('uploadSection');
    var galleryContainer = document.getElementById('galleryContainer');

    // Pending base64 string (set after FileReader resolves)
    var pendingBase64 = null;

    // ── File selection ──────────────────────────────────────────────────────
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            var file = e.target.files[0];
            if (file) { handleFile(file); }
        });
    }

    // ── Drag-and-drop ───────────────────────────────────────────────────────
    if (uploadSection) {
        uploadSection.addEventListener('dragover', function (e) {
            e.preventDefault();
            uploadSection.classList.add('drag-over');
        });
        uploadSection.addEventListener('dragleave', function (e) {
            e.preventDefault();
            uploadSection.classList.remove('drag-over');
        });
        uploadSection.addEventListener('drop', function (e) {
            e.preventDefault();
            uploadSection.classList.remove('drag-over');
            var file = e.dataTransfer.files[0];
            if (file) { handleFile(file); }
        });
    }

    // ── Confirm button ──────────────────────────────────────────────────────
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            if (!pendingBase64) { return; }
            savePhoto(pendingBase64, photoDesc ? photoDesc.value.trim() : '');
        });
    }

    // ── Cancel button ───────────────────────────────────────────────────────
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
            resetUploadUI();
        });
    }

    // ── Handle selected / dropped file ──────────────────────────────────────
    function handleFile(file) {
        hideMessages();

        if (!file.type.startsWith('image/')) {
            showError('Lütfen geçerli bir resim dosyası seçiniz (JPG, PNG, WebP).');
            resetFileInput();
            return;
        }
        if (file.size > MAX_SIZE) {
            showError(file.name + ' dosyası 5 MB sınırını aşıyor.');
            resetFileInput();
            return;
        }

        // Show progress
        if (uploadProgress) { uploadProgress.style.display = 'block'; }
        if (progressFill)   { progressFill.style.width = '0%'; }
        if (spinner)        { spinner.classList.add('show'); }

        var reader = new FileReader();

        reader.onprogress = function (e) {
            if (e.lengthComputable && progressFill) {
                progressFill.style.width = ((e.loaded / e.total) * 100) + '%';
            }
        };

        reader.onload = function (e) {
            pendingBase64 = e.target.result;

            // Show preview
            if (previewImg)      { previewImg.src = pendingBase64; }
            if (previewFilename) { previewFilename.textContent = file.name + ' (' + formatSize(file.size) + ')'; }
            if (photoDesc)       { photoDesc.value = ''; }
            if (previewArea)     { previewArea.classList.add('show'); }

            // Hide progress / spinner
            if (uploadProgress) { uploadProgress.style.display = 'none'; }
            if (progressFill)   { progressFill.style.width = '0%'; }
            if (spinner)        { spinner.classList.remove('show'); }
        };

        reader.onerror = function () {
            showError('Dosya okunurken bir hata oluştu.');
            if (uploadProgress) { uploadProgress.style.display = 'none'; }
            if (spinner)        { spinner.classList.remove('show'); }
            resetFileInput();
        };

        reader.readAsDataURL(file);
    }

    // ── Save confirmed photo ─────────────────────────────────────────────────
    function savePhoto(base64, desc) {
        var gallery = getGallery();
        gallery.push({
            id: Date.now() + Math.random(),
            url: base64,
            desc: desc,
            uploadedAt: new Date().toLocaleString('tr-TR')
        });
        setGallery(gallery);

        resetUploadUI();
        showSuccess('✅ Fotoğraf başarıyla eklendi!');
        renderGallery();
    }

    // ── Render gallery list ─────────────────────────────────────────────────
    function renderGallery() {
        if (!galleryContainer) { return; }

        var gallery = getGallery();
        var photoCount = document.getElementById('photoCount');
        if (photoCount) { photoCount.textContent = gallery.length; }

        if (gallery.length === 0) {
            galleryContainer.innerHTML = '<p class="empty-state">Henüz fotoğraf eklenmemiş</p>';
            return;
        }

        galleryContainer.innerHTML = '';
        var reversed = gallery.slice().reverse();
        reversed.forEach(function (photo) {
            var div = document.createElement('div');
            div.className = 'gallery-item';

            var imgSrc = escapeAttr(photo.url);
            var descHtml = photo.desc ? '<p class="gallery-item-desc" title="' + escapeHtml(photo.desc) + '">' + escapeHtml(photo.desc) + '</p>' : '';
            var dateHtml = photo.uploadedAt ? '<span class="gallery-item-date">' + escapeHtml(photo.uploadedAt) + '</span>' : '';
            var photoId = photo.id;

            div.innerHTML =
                '<img src="' + imgSrc + '" alt="Galeri fotoğrafı" loading="lazy"' +
                ' onerror="this.style.background=\'#222\';this.removeAttribute(\'src\')">' +
                '<div class="gallery-item-info">' +
                    descHtml +
                    dateHtml +
                    '<div class="gallery-item-actions">' +
                        '<button class="delete-btn">🗑️ Sil</button>' +
                    '</div>' +
                '</div>';

            div.querySelector('.delete-btn').addEventListener('click', function () {
                deletePhoto(photoId);
            });

            galleryContainer.appendChild(div);
        });
    }

    // ── Delete photo ────────────────────────────────────────────────────────
    function deletePhoto(id) {
        if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) { return; }
        var gallery = getGallery().filter(function (p) { return p.id !== id; });
        setGallery(gallery);
        renderGallery();
    }

    // ── Helpers ─────────────────────────────────────────────────────────────
    function getGallery() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
        catch (e) { return []; }
    }

    function setGallery(gallery) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
    }

    function resetUploadUI() {
        pendingBase64 = null;
        if (previewArea)     { previewArea.classList.remove('show'); }
        if (previewImg)      { previewImg.src = ''; }
        if (previewFilename) { previewFilename.textContent = ''; }
        if (photoDesc)       { photoDesc.value = ''; }
        if (uploadProgress)  { uploadProgress.style.display = 'none'; }
        resetFileInput();
    }

    function resetFileInput() {
        if (fileInput) { fileInput.value = ''; }
    }

    function showSuccess(msg) {
        if (!successMsg) { return; }
        successMsg.textContent = msg;
        successMsg.classList.add('show');
        if (errorMsg) { errorMsg.classList.remove('show'); }
        setTimeout(function () { successMsg.classList.remove('show'); }, 3500);
    }

    function showError(msg) {
        if (!errorMsg) { return; }
        errorMsg.textContent = '⚠️ ' + msg;
        errorMsg.classList.add('show');
        if (successMsg) { successMsg.classList.remove('show'); }
        setTimeout(function () { errorMsg.classList.remove('show'); }, 4000);
    }

    function hideMessages() {
        if (successMsg) { successMsg.classList.remove('show'); }
        if (errorMsg)   { errorMsg.classList.remove('show'); }
    }

    function formatSize(bytes) {
        if (bytes < 1024) { return bytes + ' B'; }
        if (bytes < 1024 * 1024) { return (bytes / 1024).toFixed(1) + ' KB'; }
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeAttr(str) {
        // For src attribute – just quote-escape is sufficient for data: URLs
        return String(str).replace(/"/g, '&quot;');
    }

    // ── Init ────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', renderGallery);

    // Expose deletePhoto globally for any inline usage (none in new HTML, but kept for safety)
    window.deletePhoto = deletePhoto;

}());

