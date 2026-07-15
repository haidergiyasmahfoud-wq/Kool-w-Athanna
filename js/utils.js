// ============================================================
// ============ UTILITY FUNCTIONS ==============================
// ============================================================

// ============ TOAST ============
function showToast(msg) { 
    const toast = document.getElementById('toast'); 
    toast.textContent = msg; 
    toast.classList.add('show'); 
    setTimeout(() => toast.classList.remove('show'), 2500); 
}

// ============ DARK MODE ============
function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? '' : 'dark');
    localStorage.setItem('darkMode', isDark ? '' : 'dark');
}

// ============ LAZY IMAGES ============
const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.onload = () => img.classList.add('loaded');
                img.removeAttribute('data-src');
                lazyObserver.unobserve(img);
            }
        }
    });
}, { rootMargin: '150px' });

function observeLazyImages() {
    document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));
}

// ============ NAV ACTIVE ============
function setActiveNav(el) {
    document.querySelectorAll('.bottom-nav-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
}

// ============ MOBILE SEARCH ============
function openMobileSearch() { 
    document.getElementById('mobileSearchOverlay').classList.add('active'); 
    setTimeout(() => document.getElementById('mobileSearchInput').focus(), 400); 
}
function closeMobileSearch() { 
    document.getElementById('mobileSearchOverlay').classList.remove('active'); 
}
function openMobileMenu() { 
    document.getElementById('mobileMenuSidebar').classList.add('active'); 
    document.getElementById('mobileMenuBackdrop').classList.add('active'); 
    document.body.style.overflow = 'hidden'; 
}
function closeMobileMenu() { 
    document.getElementById('mobileMenuSidebar').classList.remove('active'); 
    document.getElementById('mobileMenuBackdrop').classList.remove('active'); 
    document.body.style.overflow = ''; 
}
function quickSearch(term) { 
    document.getElementById('mobileSearchInput').value = term; 
    closeMobileSearch(); 
    globalSearch(term); 
}

// ============ SCROLL TOP ============
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('header').classList.toggle('scrolled', scrollTop > 50);
    document.getElementById('scrollTop').classList.toggle('visible', scrollTop > 400);
});

// ============ GEOLOCATION ============
let userLocation = null;

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ============ LOCAL STORAGE HELPERS ============
function getLocalData(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch { return defaultValue; }
}

function setLocalData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
}