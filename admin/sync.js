(function () {
    const keys = {
        gallery: 'adminGallery',
        content: 'adminContent',
        contact: 'adminContact',
        settings: 'adminSettings'
    };

    const safeRead = (key, fallback) => {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? fallback;
        } catch {
            return fallback;
        }
    };

    const getMapSource = (value) => {
        if (window.AdminApp?.buildMapEmbedSource) return window.AdminApp.buildMapEmbedSource(value);
        if (/^https:\/\/(www\.)?google\.[a-z.]+\/maps/i.test(String(value || ''))) return value;
        return `https://www.google.com/maps?q=${encodeURIComponent(String(value || ''))}&output=embed`;
    };

    const showSyncStatus = (message, type = 'success') => {
        const target = document.getElementById('sync-status');
        if (!target) return;
        target.textContent = message;
        target.style.color = type === 'error' ? '#e20f27' : '#d8b26a';
    };

    const updateGallery = (gallery) => {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid || !Array.isArray(gallery) || !gallery.length) return;
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');

        galleryGrid.innerHTML = '';
        gallery.forEach((photo, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'gallery-item';
            button.dataset.src = photo.url;

            const image = document.createElement('img');
            image.src = photo.url;
            image.alt = photo.desc || `Korku evi albüm görseli ${index + 1}`;
            image.loading = 'lazy';

            button.appendChild(image);
            galleryGrid.appendChild(button);

            if (lightbox && lightboxImage) {
                button.addEventListener('click', () => {
                    lightboxImage.src = photo.url;
                    lightbox.classList.add('open');
                    lightbox.setAttribute('aria-hidden', 'false');
                });
            }
        });
    };

    const updateContent = (content, settings) => {
        if (settings?.siteTitle) {
            document.title = settings.siteTitle;
            const brandText = document.querySelector('.brand span');
            if (brandText) brandText.textContent = settings.siteTitle;
        }

        if (settings?.metaDescription) {
            let meta = document.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'description';
                document.head.appendChild(meta);
            }
            meta.content = settings.metaDescription;
        }

        if (content?.siteTitle) {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) heroTitle.textContent = content.siteTitle;
        }

        if (content?.mainSlogan) {
            const heroSlogan = document.querySelector('.hero-slogan');
            if (heroSlogan) heroSlogan.textContent = content.mainSlogan;
        }

        if (content?.aboutText) {
            const aboutLead = document.querySelector('#hakkinda .section-lead');
            if (aboutLead) aboutLead.textContent = content.aboutText;
        }

        const features = [content?.feature1, content?.feature2, content?.feature3, content?.feature4].filter(Boolean);
        if (features.length) {
            const cards = document.querySelectorAll('.feature-card span');
            cards.forEach((card, index) => {
                if (features[index]) card.textContent = features[index];
            });
        }

        if (content?.detailText) {
            const contentCard = document.querySelector('#hakkinda .content-card');
            if (contentCard) contentCard.textContent = content.detailText;
        }
    };

    const updateContact = (contact) => {
        if (!contact) return;

        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach((link, index) => {
            const phone = index === 0 ? contact.phone : (contact.phone2 || contact.phone);
            if (!phone) return;
            link.href = `tel:${phone.replace(/\s+/g, '')}`;
            link.textContent = link.textContent.includes('Telefon') ? 'Telefon' : phone;
        });

        const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
        mailLinks.forEach((link) => {
            if (!contact.email) return;
            link.href = `mailto:${contact.email}`;
            link.textContent = contact.email;
        });

        const waLinks = document.querySelectorAll('a[href*="wa.me"]');
        waLinks.forEach((link) => {
            if (!contact.whatsapp) return;
            const raw = contact.whatsapp.replace(/\D+/g, '');
            link.href = `https://wa.me/${raw}`;
        });

        const instaLinks = document.querySelectorAll('a[href*="instagram.com"]');
        instaLinks.forEach((link) => {
            if (!contact.instagram) return;
            link.href = contact.instagram;
        });

        const addressCard = document.querySelector('.mini-card h3 + p');
        if (addressCard && contact.address) addressCard.textContent = contact.address;

        const mapFrame = document.querySelector('.map-card iframe');
        if (mapFrame && contact.mapEmbed) mapFrame.src = getMapSource(contact.mapEmbed);
    };

    const syncNow = () => {
        try {
            const gallery = safeRead(keys.gallery, []);
            const content = safeRead(keys.content, {});
            const contact = safeRead(keys.contact, {});
            const settings = safeRead(keys.settings, {});

            updateGallery(gallery);
            updateContent(content, settings);
            updateContact(contact);

            showSyncStatus('Senkronizasyon başarılı');
        } catch {
            showSyncStatus('Senkronizasyon hatası', 'error');
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        syncNow();
    });

    window.addEventListener('storage', (event) => {
        if (Object.values(keys).includes(event.key)) {
            syncNow();
        }
    });

    window.addEventListener('admin:data-updated', syncNow);
})();
