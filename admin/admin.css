document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    const contentArea = document.getElementById("content-area");
    const pageTitle = document.getElementById("page-title");
    const logoutButton = document.getElementById("logout-button");

    const pages = {
        dashboard: {
            title: "Genel Bakış",
            content: `
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Ana Sayfa</h3>
                        <p>Başlık, slogan ve iletişim bilgilerini yönet.</p>
                    </div>

                    <div class="dashboard-card">
                        <h3>Oyun Hikâyesi</h3>
                        <p>Hikâye metnini ve oyun açıklamalarını düzenle.</p>
                    </div>

                    <div class="dashboard-card">
                        <h3>Korku Seviyeleri</h3>
                        <p>Seviyeleri, açıklamaları ve fiyatları güncelle.</p>
                    </div>

                    <div class="dashboard-card">
                        <h3>Galeri</h3>
                        <p>Fotoğraf ve görselleri yönet.</p>
                    </div>
                </div>
            `
        },

        homepage: {
            title: "Ana Sayfa",
            content: `
                <form id="homepage-form">
                    <div class="form-group">
                        <label for="site-title">Başlık</label>
                        <input
                            type="text"
                            id="site-title"
                            placeholder="Karanlık Hat Korku Evi"
                        >
                    </div>

                    <div class="form-group">
                        <label for="site-slogan">Slogan</label>
                        <input
                            type="text"
                            id="site-slogan"
                            placeholder="Korkularınla yüzleşmeye hazır mısın?"
                        >
                    </div>

                    <div class="form-group">
                        <label for="site-summary">Kısa açıklama</label>
                        <textarea
                            id="site-summary"
                            placeholder="Ana sayfadaki kısa açıklama"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="site-address">Adres</label>
                        <textarea
                            id="site-address"
                            placeholder="Adres bilgisi"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="site-phone">Telefon</label>
                        <input
                            type="text"
                            id="site-phone"
                            placeholder="+90 533 484 2521"
                        >
                    </div>

                    <div class="form-group">
                        <label for="site-whatsapp">WhatsApp bağlantısı</label>
                        <input
                            type="text"
                            id="site-whatsapp"
                            placeholder="https://wa.me/905334842521"
                        >
                    </div>

                    <div class="form-group">
                        <label for="site-instagram">Instagram bağlantısı</label>
                        <input
                            type="text"
                            id="site-instagram"
                            placeholder="https://instagram.com/..."
                        >
                    </div>

                    <button type="submit" class="save-button">
                        Kaydet
                    </button>
                </form>
            `
        },

        story: {
            title: "Oyun Hikâyesi",
            content: `
                <form id="story-form">
                    <div class="form-group">
                        <label for="story-title">Hikâye başlığı</label>
                        <input
                            type="text"
                            id="story-title"
                            placeholder="Oyunun hikâyesi"
                        >
                    </div>

                    <div class="form-group">
                        <label for="story-text">Hikâye metni</label>
                        <textarea
                            id="story-text"
                            placeholder="Oyun hikâyesini buraya yaz"
                        ></textarea>
                    </div>

                    <button type="submit" class="save-button">
                        Kaydet
                    </button>
                </form>
            `
        },

        levels: {
            title: "Korku Seviyeleri",
            content: `
                <form id="levels-form">
                    <div class="form-group">
                        <label for="level-name">Seviye adı</label>
                        <input
                            type="text"
                            id="level-name"
                            placeholder="Amatör"
                        >
                    </div>

                    <div class="form-group">
                        <label for="level-description">Açıklama</label>
                        <textarea
                            id="level-description"
                            placeholder="Seviye açıklaması"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="level-price">Fiyat</label>
                        <input
                            type="text"
                            id="level-price"
                            placeholder="400₺"
                        >
                    </div>

                    <button type="submit" class="save-button">
                        Seviye Ekle
                    </button>
                </form>
            `
        },

        gallery: {
            title: "Galeri",
            content: `
                <form id="gallery-form">
                    <div class="form-group">
                        <label for="gallery-image">Fotoğraf bağlantısı</label>
                        <input
                            type="text"
                            id="gallery-image"
                            placeholder="https://..."
                        >
                    </div>

                    <div class="form-group">
                        <label for="gallery-alt">Fotoğraf açıklaması</label>
                        <input
                            type="text"
                            id="gallery-alt"
                            placeholder="Karanlık Hat galeri görseli"
                        >
                    </div>

                    <button type="submit" class="save-button">
                        Fotoğraf Ekle
                    </button>
                </form>
            `
        },

        faq: {
            title: "Sık Sorulan Sorular",
            content: `
                <form id="faq-form">
                    <div class="form-group">
                        <label for="faq-question">Soru</label>
                        <input
                            type="text"
                            id="faq-question"
                            placeholder="Oyun kaç dakika sürüyor?"
                        >
                    </div>

                    <div class="form-group">
                        <label for="faq-answer">Cevap</label>
                        <textarea
                            id="faq-answer"
                            placeholder="Sorunun cevabı"
                        ></textarea>
                    </div>

                    <button type="submit" class="save-button">
                        Soru Ekle
                    </button>
                </form>
            `
        },

        about: {
            title: "Hakkımızda",
            content: `
                <form id="about-form">
                    <div class="form-group">
                        <label for="about-title">Başlık</label>
                        <input
                            type="text"
                            id="about-title"
                            placeholder="Hakkımızda"
                        >
                    </div>

                    <div class="form-group">
                        <label for="about-text">Açıklama</label>
                        <textarea
                            id="about-text"
                            placeholder="Karanlık Hat hakkında açıklama"
                        ></textarea>
                    </div>

                    <button type="submit" class="save-button">
                        Kaydet
                    </button>
                </form>
            `
        },

        settings: {
            title: "Ayarlar",
            content: `
                <form id="settings-form">
                    <div class="form-group">
                        <label for="admin-name">Yönetici adı</label>
                        <input
                            type="text"
                            id="admin-name"
                            placeholder="Yönetici"
                        >
                    </div>

                    <div class="form-group">
                        <label for="admin-password">Yeni şifre</label>
                        <input
                            type="password"
                            id="admin-password"
                            placeholder="Yeni şifre"
                        >
                    </div>

                    <button type="submit" class="save-button">
                        Ayarları Kaydet
                    </button>
                </form>
            `
        }
    };

    function loadPage(pageName) {
        const selectedPage = pages[pageName];

        if (!selectedPage) {
            contentArea.innerHTML = "<p>Sayfa bulunamadı.</p>";
            return;
        }

        pageTitle.textContent = selectedPage.title;
        contentArea.innerHTML = selectedPage.content;

        menuItems.forEach((item) => {
            item.classList.toggle(
                "active",
                item.dataset.page === pageName
            );
        });

        attachFormEvents();
    }

    function attachFormEvents() {
        const forms = contentArea.querySelectorAll("form");

        forms.forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();

                alert(
                    "Şimdilik panel çalışıyor. Veritabanını bağlayınca bilgiler siteye kaydedilecek."
                );
            });
        });
    }

    menuItems.forEach((item) => {
        item.addEventListener("click", () => {
            loadPage(item.dataset.page);
        });
    });

    logoutButton.addEventListener("click", () => {
        alert("Giriş sistemi henüz bağlanmadı.");
    });

    loadPage("dashboard");
});
