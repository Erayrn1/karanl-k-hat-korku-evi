// Content Management
const CONTENT_KEY = 'adminContent';

function loadContent() {
    const content = JSON.parse(localStorage.getItem(CONTENT_KEY) || '{}');
    
    document.getElementById('siteTitle').value = content.siteTitle || 'Karanlık Hat Korku Evi';
    document.getElementById('mainSlogan').value = content.mainSlogan || 'Gerçeğin kabusa dönüştüğü yer';
    document.getElementById('siteDescription').value = content.siteDescription || '';
    document.getElementById('feature1').value = content.feature1 || 'Gerçek oyuncular';
    document.getElementById('feature2').value = content.feature2 || 'Sürükleyici senaryo';
    document.getElementById('feature3').value = content.feature3 || 'Özel efektler';
}

function saveContent() {
    const content = {
        siteTitle: document.getElementById('siteTitle').value,
        mainSlogan: document.getElementById('mainSlogan').value,
        siteDescription: document.getElementById('siteDescription').value,
        feature1: document.getElementById('feature1').value,
        feature2: document.getElementById('feature2').value,
        feature3: document.getElementById('feature3').value
    };
    
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    
    // Siteye bildir
    syncData();
    
    alert('İçerik kaydedildi!');
}

document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    
    const form = document.getElementById('contentForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveContent();
        });
    }
});