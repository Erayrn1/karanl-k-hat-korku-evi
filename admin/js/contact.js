// Contact Management
const CONTACT_KEY = 'adminContact';

function loadContact() {
    const contact = JSON.parse(localStorage.getItem(CONTACT_KEY) || '{}');
    
    document.getElementById('phone').value = contact.phone || '+90 533 484 2521';
    document.getElementById('email').value = contact.email || 'info@karanlikhat.com';
    document.getElementById('address').value = contact.address || 'Namık Kemal, 15. Sk. No:1/A D:1';
    document.getElementById('city').value = contact.city || 'Esenyurt';
    document.getElementById('province').value = contact.province || 'İstanbul';
    document.getElementById('postalCode').value = contact.postalCode || '34513';
    document.getElementById('instagram').value = contact.instagram || '';
    document.getElementById('facebook').value = contact.facebook || '';
    document.getElementById('tiktok').value = contact.tiktok || '';
}

function saveContact() {
    const contact = {
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        province: document.getElementById('province').value,
        postalCode: document.getElementById('postalCode').value,
        instagram: document.getElementById('instagram').value,
        facebook: document.getElementById('facebook').value,
        tiktok: document.getElementById('tiktok').value
    };
    
    localStorage.setItem(CONTACT_KEY, JSON.stringify(contact));
    
    // Siteye bildir
    syncData();
    
    alert('İletişim bilgileri kaydedildi!');
}

document.addEventListener('DOMContentLoaded', function() {
    loadContact();
    
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveContact();
        });
    }
});