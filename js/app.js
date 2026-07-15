// ============================================================
// ============ MAIN APPLICATION ===============================
// ============================================================

// ============ INIT ============
AOS.init({ duration: 600, once: true, disable: 'mobile' });

// Dark mode init
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode')) {
    document.documentElement.setAttribute('data-theme', 'dark');
}
if (localStorage.getItem('darkMode') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// ============ FAVORITES ============
let favorites = getLocalData('restaurant_favorites', []);
function saveFavorites() { setLocalData('restaurant_favorites', favorites); updateFavCount(); }
function isFavorite(province, restId) { return favorites.some(f => f.province === province && f.id === restId); }
function toggleFavorite(province, restId, event) {
    if (event) event.stopPropagation();
    const idx = favorites.findIndex(f => f.province === province && f.id === restId);
    if (idx > -1) { favorites.splice(idx, 1); showToast('تمت الإزالة من المفضلة'); }
    else { favorites.push({ province, id: restId }); showToast('تمت الإضافة للمفضلة ❤️'); updatePoints(2, '❤️ إضافة إلى المفضلة'); }
    saveFavorites(); renderCurrentPage();
}
function updateFavCount() {
    const el = document.getElementById('favCount');
    el.textContent = favorites.length;
    el.style.display = favorites.length > 0 ? 'flex' : 'none';
}
updateFavCount();

// ============ POINTS SYSTEM ============
let userPoints = parseInt(localStorage.getItem('userPoints') || '0');
let userLevel = 1;

function updatePoints(points, action) {
    userPoints += points;
    localStorage.setItem('userPoints', userPoints);
    updateUserLevel();
    showPointsNotification(action, points);
}

function updateUserLevel() {
    const newLevel = Math.floor(userPoints / 100) + 1;
    if (newLevel > userLevel) {
        userLevel = newLevel;
        showToast(`🎉 تهانينا! وصلت إلى المستوى ${userLevel}`);
    }
    userLevel = newLevel;
}

function showPointsNotification(action, points) {
    const notification = document.createElement('div');
    notification.className = 'points-notification';
    notification.innerHTML = `
        <div class="points-icon">⭐</div>
        <div class="points-details">
            <div class="points-action">${action}</div>
            <div class="points-amount">+${points} نقطة</div>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideDownPoints 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// ============ BROWSING HISTORY ============
let browsingHistory = getLocalData('browsingHistory', []);
function trackView(province, restId) {
    browsingHistory.push({ province, restId, timestamp: Date.now() });
    if (browsingHistory.length > 50) { browsingHistory = browsingHistory.slice(-50); }
    setLocalData('browsingHistory', browsingHistory);
    const rest = allRestaurants[province]?.find(r => r.id === restId);
    if (rest) { rest.views = (rest.views || 0) + 1; }
}

// ============ RESTAURANT CARD ============
function createRestaurantCard(province, rest, distance = null) {
    const liked = isFavorite(province, rest.id);
    const distHTML = distance !== null ? `<span class="distance-badge"><i class="fas fa-location-dot"></i> ${distance.toFixed(1)} كم</span>` : '';
    const starsHTML = '★'.repeat(Math.floor(rest.rating)) + (rest.rating%1>=0.5?'½':'') + '☆'.repeat(5-Math.ceil(rest.rating));
    const phoneDisplay = rest.phone ? `<small style="color:var(--text-secondary);font-size:0.65rem;">📞 ${rest.phone}</small>` : '';
    return `
        <div class="restaurant-card" onclick="showRestaurantDetails('${province}', '${rest.id}')">
            <div class="restaurant-image">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23eee'%3E%3Crect width='400' height='300'/%3E%3C/svg%3E" data-src="${rest.image}" alt="${rest.name}" class="lazy-img" loading="lazy" decoding="async">
                <div class="rating"><i class="fas fa-star" style="color:#FFBA08"></i> ${rest.rating}</div>
                <button class="favorite-btn ${liked?'liked':''}" onclick="toggleFavorite('${province}', '${rest.id}', event)">
                    <i class="${liked?'fas':'far'} fa-heart"></i>
                </button>
            </div>
            <div class="restaurant-info">
                <h3>${rest.name} ${distHTML}</h3>
                <div class="restaurant-cuisine"><i class="fas fa-utensils"></i> ${rest.cuisine}</div>
                <div class="star-rating-small">${starsHTML}</div>
                ${phoneDisplay}
                <div class="restaurant-footer">
                    <span class="price-range">${rest.priceRange}</span>
                    <button class="btn-details" onclick="event.stopPropagation(); showRestaurantDetails('${province}', '${rest.id}')">تفاصيل 📖</button>
                </div>
            </div>
        </div>
    `;
}

// ============ MOST VIEWED & OPEN NOW ============
function getMostViewedRestaurants(limit = 6) {
    let all = [];
    for (const p in allRestaurants) {
        allRestaurants[p].forEach(r => all.push({...r, province: p}));
    }
    all.sort((a,b) => (b.views || 0) - (a.views || 0));
    return all.slice(0, limit);
}

function getOpenNowRestaurants(limit = 6) {
    const now = new Date().getHours();
    let open = [];
    for (const p in allRestaurants) {
        allRestaurants[p].forEach(r => {
            if (r.hourStart !== undefined && r.hourEnd !== undefined) {
                const hourStart = r.hourStart || 8;
                const hourEnd = r.hourEnd || 22;
                if (now >= hourStart && now < hourEnd) {
                    open.push({...r, province: p});
                }
            }
        });
    }
    open.sort((a,b) => b.rating - a.rating);
    return open.slice(0, limit);
}

// ============ RENDER HOME ============
function renderHomeSections() {
    const mostViewed = getMostViewedRestaurants(6);
    const mvGrid = document.getElementById('mostViewedGrid');
    if (mostViewed.length > 0 && mvGrid) {
        mvGrid.innerHTML = mostViewed.map(r => createRestaurantCard(r.province, r)).join('');
        setTimeout(observeLazyImages, 200);
    }
    
    const openNow = getOpenNowRestaurants(6);
    const onGrid = document.getElementById('openNowGrid');
    if (openNow.length > 0 && onGrid) {
        onGrid.innerHTML = openNow.map(r => createRestaurantCard(r.province, r)).join('');
        setTimeout(observeLazyImages, 200);
    }
}

// ============ NAVIGATION ============
let currentProvince = null, lastRenderedPage = null;
let activeFilters = { cuisine: 'all', price: 'all', hours: 'all', sort: 'default', search: '' };
let advancedFilters = { rating: 0, delivery: false, parking: false, open24: false };

window.goBack = function() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('cityPagesContainer').innerHTML = '';
    document.getElementById('adminPanel').classList.remove('active');
    currentProvince = null; lastRenderedPage = null;
    activeFilters = { cuisine: 'all', price: 'all', hours: 'all', sort: 'default', search: '' };
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { if (provincesSwiper) { provincesSwiper.update(); provincesSwiper.autoplay.start(); } }, 300);
    renderHomeSections();
};

function renderCurrentPage() {
    if (currentProvince) renderCityPage(currentProvince);
    else if (lastRenderedPage === 'favorites') showFavorites();
    else if (lastRenderedPage === 'nearby') displayNearbyRestaurants();
    else if (lastRenderedPage === 'about') showAboutSyria();
    else if (lastRenderedPage === 'articles') showArticlesPage();
    else if (lastRenderedPage === 'map') showMapView();
}

// ============ CITY PAGE ============
window.showCityPage = function(province) {
    document.getElementById('mainPage').style.display = 'none';
    renderCityPage(province);
};

function renderCityPage(province, filters = {}) {
    activeFilters = { ...activeFilters, ...filters };
    let restaurants = [...allRestaurants[province]];
    // Apply filters...
    // (filter logic from original code)
    
    currentProvince = province;
    const container = document.getElementById('cityPagesContainer');
    const gridHtml = restaurants.map(r => createRestaurantCard(province, r)).join('');
    
    container.innerHTML = `
        <div class="city-page active">
            <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-right"></i> العودة للرئيسية</button>
            <div class="city-header"><h2>📍 ${province}</h2><p>🌟 ${restaurants.length} مطعم</p></div>
            <!-- filter bar and grid -->
            <div class="restaurants-grid">${gridHtml}</div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(observeLazyImages, 200);
}

// ============ SHOW PAGES ============
function showFavorites() { /* ... */ }
function showAboutSyria() { /* ... */ }
function showArticlesPage() { /* ... */ }
function showMapView() { /* ... */ }
function showAdminPanel() { /* ... */ }
function showRandomRestaurant() { /* ... */ }
function showAllProvinces() { /* ... */ }
function showRestaurantDetails(province, restId) { /* ... */ }

// ============ GLOBAL SEARCH ============
window.globalSearch = function(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) return;
    const term = searchTerm.trim().toLowerCase();
    let results = [];
    for (const p in allRestaurants) {
        const found = allRestaurants[p].filter(r => 
            r.name.toLowerCase().includes(term) || 
            r.cuisine.toLowerCase().includes(term) || 
            r.address.toLowerCase().includes(term)
        );
        results.push(...found.map(r => ({...r, province: p})));
    }
    if (!results.length) { showToast('لا توجد نتائج'); return; }
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('cityPagesContainer').innerHTML = `
        <div class="city-page active">
            <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-right"></i> العودة للرئيسية</button>
            <div class="city-header"><h2>🔍 نتائج البحث: "${term}"</h2></div>
            <div class="restaurants-grid">${results.map(r => createRestaurantCard(r.province, r)).join('')}</div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(observeLazyImages, 200);
};

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    renderProvinces();
    updateStats();
    renderHomeSections();
    updateComparePanel();
    document.getElementById('desktopSearch').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') globalSearch(this.value);
    });
    setTimeout(renderRecommendations, 1500);
    requestNotificationPermission();
});

// ============ SHAPES ============
for (let i = 0; i < 20; i++) {
    const shape = document.createElement('div'); shape.className = 'shape';
    const size = Math.random() * 70 + 20;
    Object.assign(shape.style, {
        width: size+'px', height: size+'px', left: Math.random()*100+'%',
        top: Math.random()*100+'%', animationDelay: Math.random()*20+'s',
        animationDuration: Math.random()*25+15+'s'
    });
    document.getElementById('shapes').appendChild(shape);
}