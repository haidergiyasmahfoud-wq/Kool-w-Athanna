// ============================================================
// ============ UI FUNCTIONS ===================================
// ============================================================

// ============ STATS ============
function updateStats() {
    let totalRestaurants = 0, totalReviews = 0, avgRating = 0;
    for (const p in allRestaurants) {
        totalRestaurants += allRestaurants[p].length;
        allRestaurants[p].forEach(r => {
            if (r.reviews) {
                totalReviews += r.reviews.length;
                const avg = r.reviews.reduce((sum, rev) => sum + rev.rating, 0);
                if (r.reviews.length > 0) { avgRating += avg / r.reviews.length; }
            }
        });
    }
    avgRating = avgRating / totalRestaurants || 0;
    const container = document.getElementById('statsContainer');
    if (container) {
        container.innerHTML = `
            <div class="stat-item"><span class="stat-number">${totalRestaurants.toLocaleString()}</span><span class="stat-label">🍽️ مطعم</span></div>
            <div class="stat-item"><span class="stat-number">${provinces.length}</span><span class="stat-label">📍 محافظة</span></div>
            <div class="stat-item"><span class="stat-number">${totalReviews.toLocaleString()}</span><span class="stat-label">⭐ تقييم</span></div>
            <div class="stat-item"><span class="stat-number">${avgRating.toFixed(1)}</span><span class="stat-label">🌟 متوسط التقييم</span></div>
        `;
    }
}
setInterval(updateStats, 30000);

// ============ RENDER PROVINCES ============
let provincesSwiper;

function renderProvinces() {
    document.getElementById('provincesWrapper').innerHTML = provinces.map(p => `
        <div class="swiper-slide"><div class="province-card" onclick="showCityPage('${p}')">
            <img src="${provinceImages[p]}" alt="${p}" class="province-image" loading="lazy" data-src="${provinceImages[p]}">
            <div class="province-card-body">
                <div class="province-icon"><i class="fas fa-${provinceIcons[p]||'city'}"></i></div>
                <div class="province-name">${p}</div>
                <div class="restaurant-count">🍽️ ${allRestaurants[p].length} مطعم</div>
            </div>
        </div></div>
    `).join('');
    if (provincesSwiper) provincesSwiper.destroy(true, true);
    const isMobile = window.innerWidth < 1024;
    provincesSwiper = new Swiper('#provincesSwiper', {
        slidesPerView: isMobile ? 1.5 : 3.5, spaceBetween: isMobile ? 10 : 25, loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: '#provincePagination', clickable: true, dynamicBullets: true },
        navigation: isMobile ? false : { nextEl: '#provinceNext', prevEl: '#provincePrev' },
        breakpoints: { 480: { slidesPerView: 2 }, 768: { slidesPerView: 2.5 }, 1024: { slidesPerView: 3.5 }, 1280: { slidesPerView: 4.5 } },
        speed: 600, grabCursor: true,
    });
    setTimeout(observeLazyImages, 300);
}

// ============ SHOW ALL PROVINCES ============
function showAllProvinces() {
    document.getElementById('mainPage').style.display = 'none';
    const container = document.getElementById('cityPagesContainer');
    container.innerHTML = `
        <div class="city-page active">
            <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-right"></i> العودة للرئيسية</button>
            <div class="city-header">
                <h2>🗺️ جميع المحافظات</h2>
                <p>${provinces.length} محافظة تضم أكثر من 7000 مطعم</p>
            </div>
            <div class="province-grid-all">
                ${provinces.map(p => `
                    <div class="province-card-large" onclick="showCityPage('${p}')">
                        <div class="province-card-image">
                            <img src="${provinceImages[p]}" alt="${p}" loading="lazy" data-src="${provinceImages[p]}">
                            <div class="province-card-overlay">
                                <span class="province-name-large">${p}</span>
                                <span class="restaurant-count-large">${allRestaurants[p].length} مطعم</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    lastRenderedPage = 'allProvinces';
    setTimeout(observeLazyImages, 200);
}

// ============ CITY PAGE FILTERS ============
function applyFilter(key, value) { 
    if (currentProvince) { 
        activeFilters[key] = value; 
        renderCityPage(currentProvince); 
    } 
}

function resetFilters() { 
    activeFilters = { cuisine: 'all', price: 'all', hours: 'all', sort: 'default', search: '' };
    advancedFilters = { rating: 0, delivery: false, parking: false, open24: false };
    document.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('active'));
    if (currentProvince) renderCityPage(currentProvince); 
}

function toggleAdvancedFilters() {
    const panel = document.getElementById('advancedFilters');
    if (!panel) return;
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
}

function filterByRating(rating) {
    advancedFilters.rating = rating;
    document.querySelectorAll('.rating-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.rating) === rating);
    });
    if (currentProvince) renderCityPage(currentProvince);
}

// ============ SHOW FAVORITES ============
function showFavorites() {
    if (favorites.length === 0) { showToast('لا توجد مطاعم مفضلة'); return; }
    document.getElementById('mainPage').style.display = 'none';
    const container = document.getElementById('cityPagesContainer');
    let html = '';
    favorites.forEach(fav => {
        const rest = allRestaurants[fav.province]?.find(r => r.id === fav.id);
        if (rest) html += createRestaurantCard(fav.province, rest);
    });
    container.innerHTML = `
        <div class="city-page active">
            <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-right"></i> العودة للرئيسية</button>
            <div class="city-header">
                <h2>❤️ مطاعمي المفضلة</h2>
                <button class="share-list-btn" onclick="shareFavorites()" style="background:var(--primary);color:white;border:none;padding:6px 16px;border-radius:50px;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:0.75rem;margin-top:6px;">
                    <i class="fas fa-share-alt"></i> مشاركة القائمة
                </button>
            </div>
            <div class="restaurants-grid">${html}</div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(observeLazyImages, 200);
    lastRenderedPage = 'favorites';
}

function shareFavorites() {
    if (favorites.length === 0) { showToast('لا توجد مطاعم مفضلة للمشاركة'); return; }
    let shareText = '🍽️ قائمة مطاعمي المفضلة على كول واتهنى:\n\n';
    favorites.forEach(fav => {
        const rest = allRestaurants[fav.province]?.find(r => r.id === fav.id);
        if (rest) {
            shareText += `📍 ${rest.name} - ${fav.province}\n`;
            shareText += `   ⭐ ${rest.rating}/5 | ${rest.cuisine}\n`;
        }
    });
    shareText += '\n🔗 اكتشف المزيد: https://wheretoeat.today/';
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
}

// ============ ABOUT SYRIA ============
window.showAboutSyria = function() {
    document.getElementById('mainPage').style.display = 'none';
    const container = document.getElementById('cityPagesContainer');
    const landmarks = 'الجامع الأموي (دمشق)، قلعة حلب، قلعة الحصن (حمص)، النواعير (حماة)، أوغاريت (اللاذقية)، جزيرة أرواد (طرطوس)، دورا أوروبوس (دير الزور)، مملكة إيبلا (إدلب)، مدرج بصرى (درعا)، مرتفعات الجولان (القنيطرة)';
    const facts = 'المساحة: 185,180 كم² | السكان: ~22 مليون | العاصمة: دمشق | اللغة: العربية | العملة: الليرة السورية';
    container.innerHTML = `
        <div class="about-page city-page active">
            <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-right"></i> العودة للرئيسية</button>
            <div class="about-hero">
                <h1>عن سوريا - أرض الحضارات</h1>
                <p>مهد أقدم الحضارات في التاريخ وأجمل مطبخ في العالم العربي</p>
            </div>
            <div class="about-grid">
                <div class="about-card"><h3>📜 لمحة تاريخية</h3><p>سوريا من أقدم مناطق العالم المأهولة، قامت فيها حضارات عريقة. دمشق أقدم عاصمة مأهولة في التاريخ.</p></div>
                <div class="about-card"><h3>🍽️ المطبخ السوري</h3><p>يعتبر من أغنى المطابخ العربية. أشهر أكلاته: الكبة، اليبرق، الشاورما، الفتوش، الكنافة، البقلاوة.</p></div>
                <div class="about-card"><h3>🏛️ أشهر المعالم</h3><p>${landmarks}</p></div>
                <div class="about-card"><h3>📊 حقائق سريعة</h3><p>${facts}</p></div>
            </div>
            <h2 class="section-title">🗺️ المحافظات السورية</h2>
            <div class="province-detail-grid">
                ${provinces.map(p => {
                    const info = provinceInfo[p] || { desc: '', famous: '' };
                    return `
                        <div class="province-detail-card" onclick="showCityPage('${p}')">
                            <img src="${provinceImages[p]}" alt="${p}" loading="lazy" data-src="${provinceImages[p]}">
                            <div class="detail-body">
                                <h4><i class="fas fa-${provinceIcons[p]||'city'}" style="color:var(--primary);margin-left:5px;"></i> ${p}</h4>
                                <p>${info.desc}</p>
                                <p style="margin-top:4px;font-weight:500;color:var(--primary);font-size:0.68rem;">🏛️ ${info.famous}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(observeLazyImages, 200);
    lastRenderedPage = 'about';
};

// ============ ARTICLES ============
function showArticlesPage() {
    document.getElementById('mainPage').style.display = 'none';
    const container = document.getElementById('cityPagesContainer');
    container.innerHTML = `
        <div class="city-page active">
            <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-right"></i> العودة للرئيسية</button>
            <div class="city-header">
                <h2>📚 مقالات المطبخ السوري</h2>
                <p>اكتشف أسرار وأطباق المطبخ السوري الأصيل</p>
            </div>
            <div class="articles-grid">
                ${articles.map(article => `
                    <div class="article-card" onclick="showArticle(${article.id})">
                        <div class="article-image">
                            <img src="${article.image}" alt="${article.title}" loading="lazy" data-src="${article.image}">
                            <span class="article-category">${article.category}</span>
                        </div>
                        <div class="article-content">
                            <h3>${article.title}</h3>
                            <p>${article.description}</p>
                            <div class="article-meta">
                                <span><i class="far fa-calendar-alt"></i> ${article.date}</span>
                                <span><i class="far fa-user"></i> ${article.author}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(observeLazyImages, 200);
    lastRenderedPage = 'articles';
}

function showArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    document.getElementById('mainPage').style.display = 'none';
    const container = document.getElementById('cityPagesContainer');
    container.innerHTML = `
        <div class="city-page active">
            <button class="back-btn" onclick="showArticlesPage()"><i class="fas fa-arrow-right"></i> العودة للمقالات</button>
            <article class="article-full">
                <h1 class="article-full-title">${article.title}</h1>
                <div class="article-full-meta">
                    <span><i class="far fa-calendar-alt"></i> ${article.date}</span>
                    <span><i class="far fa-user"></i> ${article.author}</span>
                    <span><i class="fas fa-tag"></i> ${article.category}</span>
                </div>
                <img src="${article.image}" alt="${article.title}" class="article-full-image">
                <div class="article-full-content">
                    ${article.content.split('\n').map(p => `<p>${p}</p>`).join('')}
                </div>
                <div class="article-share">
                    <h4>شارك المقال</h4>
                    <div class="share-buttons">
                        <button class="share-btn whatsapp" onclick="shareArticle('${article.title}', 'whatsapp')">
                            <i class="fab fa-whatsapp"></i> واتساب
                        </button>
                        <button class="share-btn facebook" onclick="shareArticle('${article.title}', 'facebook')">
                            <i class="fab fa-facebook-f"></i> فيسبوك
                        </button>
                        <button class="share-btn telegram" onclick="shareArticle('${article.title}', 'telegram')">
                            <i class="fab fa-telegram-plane"></i> تلغرام
                        </button>
                    </div>
                </div>
            </article>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function shareArticle(title, platform) {
    const url = window.location.href;
    const text = `📖 اقرأ مقال: ${title} على كول واتهنى`;
    const shareUrls = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    };
    window.open(shareUrls[platform], '_blank');
}

// ============ MAP VIEW ============
let map = null;
let mapMarkers = [];

function showMapView() {
    document.getElementById('mainPage').style.display = 'none';
    const container = document.getElementById('cityPagesContainer');
    let allRestaurantsList = [];
    for (const p in allRestaurants) {
        allRestaurants[p].forEach(r => {
            allRestaurantsList.push({
                ...r,
                province: p,
                lat: r.lat || provinceCoords[p]?.lat + (Math.random() - 0.5) * 0.05,
                lng: r.lng || provinceCoords[p]?.lng + (Math.random() - 0.5) * 0.05
            });
        });
    }
    container.innerHTML = `
        <div class="city-page active">
            <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-right"></i> العودة للرئيسية</button>
            <div class="city-header">
                <h2>🗺️ خريطة المطاعم</h2>
                <p>${allRestaurantsList.length} مطعم موزع على ${provinces.length} محافظة</p>
            </div>
            <div id="mapContainer"></div>
            <div class="map-filters">
                <select id="mapProvinceFilter" onchange="filterMapByProvince(this.value)">
                    <option value="all">جميع المحافظات</option>
                    ${provinces.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
                <select id="mapCuisineFilter" onchange="filterMapByCuisine(this.value)">
                    <option value="all">جميع المطابخ</option>
                    ${cuisineTypes.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        const mapContainer = document.getElementById('mapContainer');
        if (mapContainer && typeof L !== 'undefined') {
            if (map) { map.remove(); map = null; }
            map = L.map('mapContainer').setView([34.8, 37.5], 7);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            mapMarkers = [];
            const allData = [];
            for (const p in allRestaurants) {
                allRestaurants[p].forEach(r => {
                    allData.push({
                        ...r,
                        province: p,
                        lat: r.lat || provinceCoords[p]?.lat + (Math.random() - 0.5) * 0.05,
                        lng: r.lng || provinceCoords[p]?.lng + (Math.random() - 0.5) * 0.05
                    });
                });
            }
            allData.forEach(r => {
                const marker = L.marker([r.lat, r.lng]).addTo(map);
                marker.bindPopup(`
                    <b>${r.name}</b><br>
                    ${r.cuisine}<br>
                    ⭐ ${r.rating}/5<br>
                    📍 ${r.province}<br>
                    <button onclick="showRestaurantDetails('${r.province}','${r.id}');closeModal();" style="background:#E85D04;color:white;border:none;padding:4px 12px;border-radius:20px;cursor:pointer;">عرض التفاصيل</button>
                `);
                marker._restaurant = { province: r.province, id: r.id };
                mapMarkers.push(marker);
            });
            map.invalidateSize();
        } else {
            mapContainer.innerHTML = `
                <div style="padding:20px;text-align:center;background:var(--bg-input);border-radius:var(--radius);height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <i class="fas fa-map" style="font-size:3rem;color:var(--primary);margin-bottom:10px;"></i>
                    <h4 style="color:var(--text);">خريطة المطاعم التفاعلية</h4>
                    <p style="color:var(--text-secondary);font-size:0.75rem;">${allRestaurantsList.length} مطعم متاح</p>
                </div>
            `;
        }
    }, 300);
    lastRenderedPage = 'map';
}

function filterMapByProvince(province) {
    if (!map || !mapMarkers.length) return;
    mapMarkers.forEach(marker => {
        const rest = marker._restaurant;
        if (!rest) return;
        if (province === 'all' || rest.province === province) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
}

function filterMapByCuisine(cuisine) {
    if (!map || !mapMarkers.length) return;
    mapMarkers.forEach(marker => {
        const rest = marker._restaurant;
        if (!rest) return;
        const restaurant = allRestaurants[rest.province]?.find(r => r.id === rest.id);
        if (!restaurant) return;
        if (cuisine === 'all' || restaurant.cuisine === cuisine) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
}

// ============ NEARBY RESTAURANTS ============
function findNearbyRestaurants() {
    const btn = document.getElementById('nearbyBtn');
    btn.classList.add('loading');
    if (!navigator.geolocation) { showToast('لم نتمكن من الوصول لموقعك'); btn.classList.remove('loading'); return; }
    navigator.geolocation.getCurrentPosition(
        pos => { userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }; displayNearbyRestaurants(); btn.classList.remove('loading'); },
        err => { showToast('لم نتمكن من الوصول لموقعك'); btn.classList.remove('loading'); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
}

function displayNearbyRestaurants() {
    if (!userLocation) return;
    let all = [];
    for (const p in allRestaurants) {
        allRestaurants[p].forEach(r => all.push({...r, province: p, distance: getDistance(userLocation.lat, userLocation.lng, r.lat, r.lng)}));
    }
    all.sort((a,b) => a.distance - b.distance);
    if (!all.length) { showToast('لا توجد مطاعم قريبة'); return; }
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('cityPagesContainer').innerHTML = `
        <div class="city-page active">
            <button class="back-btn" onclick="goBack()"><i class="fas fa-arrow-right"></i> العودة للرئيسية</button>
            <div class="city-header"><h2>📍 أقرب المطاعم منك</h2></div>
            <div class="restaurants-grid">${all.slice(0,20).map(r => createRestaurantCard(r.province, r, r.distance)).join('')}</div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(observeLazyImages, 200);
    lastRenderedPage = 'nearby';
}

// ============ RANDOM RESTAURANT ============
function showRandomRestaurant() {
    let allRestaurantsList = [];
    for (const p in allRestaurants) {
        allRestaurants[p].forEach(r => { allRestaurantsList.push({...r, province: p}); });
    }
    const randomRest = allRestaurantsList[Math.floor(Math.random() * allRestaurantsList.length)];
    if (randomRest) {
        showRestaurantDetails(randomRest.province, randomRest.id);
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.innerHTML = '🎉';
        celebration.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 5rem; z-index: 99999; pointer-events: none;
            animation: celebrationAnim 1s ease forwards;
        `;
        document.body.appendChild(celebration);
        setTimeout(() => celebration.remove(), 1500);
    }
}

// ============ RESTAURANT DETAILS MODAL ============
let currentReviewRestaurant = null, currentReviewProvince = null, selectedRating = 0;
let reviewImages = [];
let currentCompareList = getLocalData('compareList', []);

window.showRestaurantDetails = function(province, restId) {
    const rest = allRestaurants[province].find(r => r.id === restId);
    if (!rest) return;
    trackView(province, restId);
    currentReviewProvince = province; currentReviewRestaurant = restId; selectedRating = 0; reviewImages = [];
    document.getElementById('modalTitle').innerHTML = rest.name;
    document.getElementById('modalCuisine').innerHTML = `<i class="fas fa-utensils"></i> ${rest.cuisine}`;
    document.getElementById('modalRating').innerHTML = `<i class="fas fa-star" style="color:#FFBA08"></i> ${rest.rating} / 5 ⭐`;
    document.getElementById('modalImage').src = rest.image;
    document.getElementById('modalImage').style.display = 'block';
    document.getElementById('modalDesc').innerHTML = rest.description;
    document.getElementById('modalAddress').innerHTML = `<i class="fas fa-map-marker-alt"></i> 📍 ${rest.address}`;
    document.getElementById('modalPhone').innerHTML = `<i class="fas fa-phone"></i> 📞 ${rest.phone || 'غير متوفر'}`;
    document.getElementById('modalHours').innerHTML = `<i class="fas fa-clock"></i> 🕐 ${rest.openingHours}`;
    document.getElementById('modalPrice').innerHTML = `<i class="fas fa-tag"></i> 💰 ${rest.priceRange}`;
    document.getElementById('modalMap').innerHTML = `<iframe width="100%" height="180" style="border:0;border-radius:15px;" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${rest.lat},${rest.lng}&zoom=15&language=ar"></iframe>`;
    const whatsappMsg = `مرحباً، أرغب بالطلب من مطعم ${rest.name} في ${province}%0Aالاسم: [اكتب اسمك]%0Aالطلب: [اكتب طلبك]`;
    if (rest.phone) {
        document.getElementById('modalWhatsapp').onclick = () => window.open(`https://wa.me/963${rest.phone}?text=${whatsappMsg}`, '_blank');
        document.getElementById('modalWhatsapp').style.display = 'inline-flex';
    } else {
        document.getElementById('modalWhatsapp').style.display = 'none';
    }
    setupShareButtons(province, rest);
    renderReviews(rest);
    initStarInput();
    document.getElementById('reviewText').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('reviewImage').value = '';
    document.getElementById('restaurantModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').value = today;
    document.getElementById('bookingDate').min = today;
};

function closeModal() {
    document.getElementById('restaurantModal').classList.remove('active');
    document.body.style.overflow = '';
}

function initStarInput() {
    const stars = document.querySelectorAll('#starInput i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.star);
            stars.forEach(s => s.className = parseInt(s.dataset.star) <= selectedRating ? 'fas fa-star active' : 'far fa-star');
        });
    });
}

function setupShareButtons(province, rest) {
    const shareText = encodeURIComponent(`شاهد مطعم ${rest.name} في ${province} - تقييم ${rest.rating}⭐`);
    const shareUrl = encodeURIComponent(window.location.href);
    document.getElementById('shareWhatsapp').onclick = () => { updatePoints(3, '📤 مشاركة عبر واتساب'); window.open(`https://wa.me/?text=${shareText}%20${shareUrl}`, '_blank'); };
    document.getElementById('shareFacebook').onclick = () => { updatePoints(3, '📤 مشاركة عبر فيسبوك'); window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`, '_blank'); };
    document.getElementById('shareTelegram').onclick = () => { updatePoints(3, '📤 مشاركة عبر تلغرام'); window.open(`https://t.me/share/url?url=${shareUrl}&text=${shareText}`, '_blank'); };
}

// ============ BOOKING ============
function submitBooking() {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const people = document.getElementById('bookingPeople').value;
    if (!date || !time || !people) { showToast('الرجاء ملء جميع الحقول'); return; }
    const rest = allRestaurants[currentReviewProvince]?.find(r => r.id === currentReviewRestaurant);
    if (!rest) return;
    const message = `📅 طلب حجز طاولة\n\n🍽️ مطعم: ${rest.name}\n📍 ${rest.address}\n📞 ${rest.phone || 'غير متوفر'}\n\n📆 التاريخ: ${date}\n🕐 الوقت: ${time}\n👥 عدد الأشخاص: ${people}\n\nيرجى تأكيد الحجز`;
    if (rest.phone) {
        window.open(`https://wa.me/963${rest.phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
        window.location.href = `mailto:booking@wheretoeat.today?subject=حجز طاولة في ${rest.name}&body=${encodeURIComponent(message)}`;
    }
    updatePoints(3, '📅 حجز طاولة');
    showToast('تم إرسال طلب الحجز ✅');
}

// ============ REVIEW SYSTEM ============
function submitReview() {
    if (!currentReviewProvince || !currentReviewRestaurant) return;
    const text = document.getElementById('reviewText').value.trim();
    if (!text && selectedRating === 0 && reviewImages.length === 0) { showToast('الرجاء إدخال نص أو اختيار صورة'); return; }
    const rest = allRestaurants[currentReviewProvince].find(r => r.id === currentReviewRestaurant);
    if (!rest) return;
    const review = {
        rating: selectedRating,
        text: text,
        images: reviewImages.slice(0, 3),
        date: new Date().toLocaleDateString('ar-SY'),
        user: 'زائر كريم'
    };
    rest.reviews.unshift(review);
    reviewImages = [];
    document.getElementById('reviewText').value = '';
    selectedRating = 0;
    document.querySelectorAll('#starInput i').forEach(s => s.className = 'far fa-star');
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('reviewImage').value = '';
    renderReviews(rest);
    updatePoints(5, '📝 تقييم مطعم');
    showToast('تم حفظ تقييمك! ⭐');
}

function renderReviews(rest) {
    const container = document.getElementById('existingReviews');
    if (!rest.reviews || rest.reviews.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary);font-size:0.75rem;">لا توجد تقييمات بعد</p>';
        return;
    }
    container.innerHTML = rest.reviews.map(r => `
        <div class="review-item">
            <div class="review-header">
                <div class="review-user"><span class="user-icon">👤</span> <span class="user-name">${r.user || 'زائر'}</span></div>
                <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                <span class="review-date">${r.date}</span>
            </div>
            ${r.text ? `<p class="review-text">${r.text}</p>` : ''}
            ${r.images && r.images.length > 0 ? `
                <div class="review-images">${r.images.map(img => `<img src="${img}" alt="صورة التقييم">`).join('')}</div>
            ` : ''}
        </div>
    `).join('');
}

// ============ COMPARE SYSTEM ============
function addToCompare() {
    if (!currentReviewProvince || !currentReviewRestaurant) return;
    const rest = allRestaurants[currentReviewProvince]?.find(r => r.id === currentReviewRestaurant);
    if (!rest) return;
    const exists = currentCompareList.some(item => item.province === currentReviewProvince && item.id === currentReviewRestaurant);
    if (exists) { showToast('المطعم موجود بالفعل في قائمة المقارنة'); return; }
    if (currentCompareList.length >= 3) { showToast('يمكنك مقارنة 3 مطاعم كحد أقصى'); return; }
    currentCompareList.push({ province: currentReviewProvince, id: currentReviewRestaurant });
    setLocalData('compareList', currentCompareList);
    showToast('تمت إضافة المطعم للمقارنة ⚖️');
    updateComparePanel();
}

function removeFromCompare(index) {
    currentCompareList.splice(index, 1);
    setLocalData('compareList', currentCompareList);
    updateComparePanel();
    if (currentCompareList.length === 0) {
        document.getElementById('comparePanel').classList.remove('active');
        document.getElementById('compareResultsContainer').innerHTML = '';
    }
}

function updateComparePanel() {
    const panel = document.getElementById('comparePanel');
    const items = document.getElementById('compareItems');
    const count = document.getElementById('compareCount');
    if (currentCompareList.length === 0) {
        panel.classList.remove('active');
        return;
    }
    panel.classList.add('active');
    count.textContent = currentCompareList.length;
    items.innerHTML = currentCompareList.map((item, index) => {
        const rest = allRestaurants[item.province]?.find(r => r.id === item.id);
        if (!rest) return '';
        return `
            <div class="compare-item">
                <span>${rest.name}</span>
                <span class="remove-compare" onclick="removeFromCompare(${index})">✕</span>
            </div>
        `;
    }).join('');
}

function clearCompare() {
    currentCompareList = [];
    setLocalData('compareList', currentCompareList);
    document.getElementById('comparePanel').classList.remove('active');
    document.getElementById('compareResultsContainer').innerHTML = '';
    showToast('تم مسح قائمة المقارنة');
}

function showCompareResults() {
    if (currentCompareList.length < 2) { showToast('الرجاء إضافة مطعمين على الأقل للمقارنة'); return; }
    const container = document.getElementById('compareResultsContainer');
    let tableHTML = `
        <div class="compare-results active">
            <h3 style="color:var(--primary);margin-bottom:10px;">⚖️ مقارنة المطاعم</h3>
            <table>
                <thead>
                    <tr>
                        <th>الميزة</th>
                        ${currentCompareList.map(item => {
                            const rest = allRestaurants[item.province]?.find(r => r.id === item.id);
                            return `<th>${rest?.name || 'غير معروف'}</th>`;
                        }).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>⭐ التقييم</td>
                        ${currentCompareList.map(item => {
                            const rest = allRestaurants[item.province]?.find(r => r.id === item.id);
                            return `<td>${rest?.rating || 'N/A'}/5</td>`;
                        }).join('')}
                    </tr>
                    <tr>
                        <td>💰 السعر</td>
                        ${currentCompareList.map(item => {
                            const rest = allRestaurants[item.province]?.find(r => r.id === item.id);
                            return `<td>${rest?.priceRange || 'N/A'}</td>`;
                        }).join('')}
                    </tr>
                    <tr>
                        <td>🍽️ المطبخ</td>
                        ${currentCompareList.map(item => {
                            const rest = allRestaurants[item.province]?.find(r => r.id === item.id);
                            return `<td>${rest?.cuisine || 'N/A'}</td>`;
                        }).join('')}
                    </tr>
                    <tr>
                        <td>📍 المحافظة</td>
                        ${currentCompareList.map(item => `<td>${item.province}</td>`).join('')}
                    </tr>
                    <tr>
                        <td>🕐 ساعات العمل</td>
                        ${currentCompareList.map(item => {
                            const rest = allRestaurants[item.province]?.find(r => r.id === item.id);
                            return `<td>${rest?.openingHours || 'N/A'}</td>`;
                        }).join('')}
                    </tr>
                    <tr>
                        <td>📞 الهاتف</td>
                        ${currentCompareList.map(item => {
                            const rest = allRestaurants[item.province]?.find(r => r.id === item.id);
                            return `<td>${rest?.phone || 'N/A'}</td>`;
                        }).join('')}
                    </tr>
                </tbody>
            </table>
            <button onclick="document.getElementById('compareResultsContainer').innerHTML=''" style="margin-top:10px;background:var(--primary);color:white;border:none;padding:6px 16px;border-radius:50px;cursor:pointer;font-family:'Tajawal',sans-serif;">إغلاق</button>
        </div>
    `;
    container.innerHTML = tableHTML;
    container.scrollIntoView({ behavior: 'smooth' });
}

// ============ ADMIN PANEL ============
function showAdminPanel() {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('adminPanel').classList.add('active');
    document.getElementById('cityPagesContainer').innerHTML = '';
    updateAdminStats();
    renderAdminReviews();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.remove('active');
    goBack();
}

function updateAdminStats() {
    let total = 0, totalReviews = 0, totalViews = 0;
    for (const p in allRestaurants) {
        total += allRestaurants[p].length;
        allRestaurants[p].forEach(r => {
            if (r.reviews) totalReviews += r.reviews.length;
            totalViews += (r.views || 0);
        });
    }
    document.getElementById('adminStats').innerHTML = `
        <div class="stat-item"><span class="stat-number">${total}</span><span class="stat-label">🍽️ مطعم</span></div>
        <div class="stat-item"><span class="stat-number">${totalReviews}</span><span class="stat-label">⭐ تقييم</span></div>
        <div class="stat-item"><span class="stat-number">${totalViews}</span><span class="stat-label">👀 مشاهدة</span></div>
        <div class="stat-item"><span class="stat-number">${browsingHistory.length}</span><span class="stat-label">📊 زيارات</span></div>
    `;
}

function renderAdminReviews() {
    const container = document.getElementById('adminReviewsList');
    let allReviews = [];
    for (const p in allRestaurants) {
        allRestaurants[p].forEach(r => {
            if (r.reviews && r.reviews.length > 0) {
                r.reviews.forEach((rev, idx) => {
                    allReviews.push({
                        restaurant: r.name,
                        province: p,
                        review: rev,
                        index: idx,
                        restId: r.id
                    });
                });
            }
        });
    }
    if (allReviews.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary);font-size:0.75rem;">لا توجد تقييمات</p>';
        return;
    }
    container.innerHTML = allReviews.map((item, i) => `
        <div class="admin-list-item">
            <span><b>${item.restaurant}</b> (${item.province}) - ${'★'.repeat(item.review.rating)}${'☆'.repeat(5-item.review.rating)} ${item.review.text ? item.review.text.substring(0,30)+'...' : ''}</span>
            <button class="delete-btn" onclick="deleteReview('${item.province}','${item.restId}',${item.index})">حذف</button>
        </div>
    `).join('');
}

function deleteReview(province, restId, index) {
    const rest = allRestaurants[province]?.find(r => r.id === restId);
    if (!rest || !rest.reviews || !rest.reviews[index]) return;
    rest.reviews.splice(index, 1);
    renderAdminReviews();
    showToast('تم حذف التقييم');
}

function addNewRestaurant(event) {
    event.preventDefault();
    const name = document.getElementById('newRestName').value.trim();
    const cuisine = document.getElementById('newRestCuisine').value.trim();
    const province = document.getElementById('newRestProvince').value.trim();
    const rating = parseFloat(document.getElementById('newRestRating').value);
    const priceRange = document.getElementById('newRestPriceRange').value.trim();
    const address = document.getElementById('newRestAddress').value.trim();
    const phone = document.getElementById('newRestPhone').value.trim();
    const hours = document.getElementById('newRestHours').value.trim();
    const desc = document.getElementById('newRestDesc').value.trim();
    const image = document.getElementById('newRestImage').value.trim() || imagePool[0];
    
    if (!name || !cuisine || !province || isNaN(rating) || !priceRange || !address) {
        showToast('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    if (!allRestaurants[province]) {
        showToast('المحافظة غير موجودة');
        return;
    }
    const priceLevel = { '$':1, '$$':2, '$$$':3, '$$$$':4 }[priceRange] || 2;
    const coords = provinceCoords[province] || { lat: 33.5, lng: 36.3 };
    const newRest = {
        id: `admin_${Date.now()}`,
        name, cuisine, rating: Math.min(5, Math.max(0, rating)), priceRange, priceLevel,
        description: desc || `مطعم ${name} في ${province}`,
        address, phone, image,
        openingHours: hours || '10:00 صباحاً - 11:00 مساءً',
        hourStart: 10, hourEnd: 23,
        lat: coords.lat + (Math.random() - 0.5) * 0.02,
        lng: coords.lng + (Math.random() - 0.5) * 0.02,
        reviews: [],
        views: 0
    };
    allRestaurants[province].unshift(newRest);
    try {
        const cache = {};
        for (const p in allRestaurants) {
            cache[p] = allRestaurants[p].map(r => ({ ...r, reviews: r.reviews ? r.reviews.slice(0, 10) : [] }));
        }
        setLocalData('cachedRestaurants', cache);
    } catch (e) {}
    document.getElementById('addRestaurantForm').reset();
    updateAdminStats();
    showToast(`✅ تم إضافة مطعم ${name} بنجاح`);
    updateStats();
    if (currentProvince) renderCityPage(currentProvince);
}

// ============ RECOMMENDATIONS ============
function getRecommendations() {
    if (browsingHistory.length === 0) return [];
    const preferences = { cuisines: {}, provinces: {}, priceLevels: {} };
    browsingHistory.forEach(record => {
        const rest = allRestaurants[record.province]?.find(r => r.id === record.restId);
        if (rest) {
            preferences.cuisines[rest.cuisine] = (preferences.cuisines[rest.cuisine] || 0) + 1;
            preferences.provinces[record.province] = (preferences.provinces[record.province] || 0) + 1;
            preferences.priceLevels[rest.priceLevel] = (preferences.priceLevels[rest.priceLevel] || 0) + 1;
        }
    });
    const topCuisine = Object.keys(preferences.cuisines).reduce((a,b) => preferences.cuisines[a] > preferences.cuisines[b] ? a : b);
    const topProvince = Object.keys(preferences.provinces).reduce((a,b) => preferences.provinces[a] > preferences.provinces[b] ? a : b);
    let recommendations = [];
    for (const p in allRestaurants) {
        allRestaurants[p].forEach(r => {
            if (r.cuisine === topCuisine && p === topProvince) {
                const viewed = browsingHistory.some(h => h.province === p && h.id === r.id);
                if (!viewed) { recommendations.push({...r, province: p}); }
            }
        });
    }
    recommendations.sort((a,b) => b.rating - a.rating);
    return recommendations.slice(0, 6);
}

function renderRecommendations() {
    const recs = getRecommendations();
    if (recs.length === 0) return;
    let container = document.querySelector('.recommendations-container');
    if (!container) {
        const mainPage = document.getElementById('mainPage');
        container = document.createElement('div');
        container.className = 'recommendations-container';
        container.innerHTML = `<h2 class="section-title">🤖 نوصي لك</h2><div class="restaurants-grid" id="recGrid"></div>`;
        const slider = document.querySelector('.provinces-slider-container');
        if (slider) slider.parentNode.insertBefore(container, slider.nextSibling);
    }
    const grid = document.getElementById('recGrid') || container.querySelector('.restaurants-grid');
    if (grid) {
        grid.innerHTML = recs.map(r => createRestaurantCard(r.province, r)).join('');
        setTimeout(observeLazyImages, 200);
    }
}

// ============ NOTIFICATIONS ============
function requestNotificationPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') showToast('🔔 سيتم إعلامك بالعروض والمطاعم الجديدة');
        });
    }
    return false;
}

function sendNotification(title, body) {
    if (Notification.permission !== 'granted') return;
    try {
        const notification = new Notification(title, {
            body: body,
            icon: '🍽️',
            vibrate: [200, 100, 200],
            tag: 'kolo-atanhy',
            requireInteraction: true
        });
        notification.onclick = function() { window.focus(); notification.close(); };
        setTimeout(() => notification.close(), 10000);
    } catch (e) {}
}

// ============ INSTALL PROMPT ============
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const prompt = document.createElement('div');
    prompt.className = 'install-prompt';
    prompt.id = 'installPrompt';
    prompt.innerHTML = `
        <div class="install-prompt-content">
            <div class="install-icon">📱</div>
            <div class="install-text">
                <h4>ثبّت التطبيق على جهازك</h4>
                <p>احصل على تجربة أفضل وسرعة أكبر</p>
            </div>
            <button class="install-btn" onclick="installApp()">تثبيت</button>
            <button class="install-close" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    document.body.appendChild(prompt);
});

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                document.getElementById('installPrompt')?.remove();
            }
            deferredPrompt = null;
        });
    }
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeMobileSearch(); closeMobileMenu(); }
    if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        if (!document.activeElement?.tagName === 'INPUT') { showFavorites(); }
    }
});

// ============ CACHE ============
function cacheRestaurants() {
    try {
        const cache = {};
        for (const p in allRestaurants) {
            cache[p] = allRestaurants[p].map(r => ({ ...r, reviews: r.reviews ? r.reviews.slice(0, 10) : [] }));
        }
        setLocalData('cachedRestaurants', cache);
    } catch (e) {}
}

window.addEventListener('online', () => { showToast('🌐 تم استعادة الاتصال بالإنترنت'); cacheRestaurants(); });
window.addEventListener('offline', () => {
    showToast('⚠️ أنت غير متصل، يتم عرض البيانات المخزنة');
    const cached = getLocalData('cachedRestaurants', null);
    if (cached) {
        try {
            for (const p in cached) {
                if (!allRestaurants[p] || allRestaurants[p].length === 0) {
                    allRestaurants[p] = cached[p];
                }
            }
            renderCurrentPage();
        } catch (e) {}
    }
});

setInterval(cacheRestaurants, 60000);

// ============ IMAGE PREVIEW FOR REVIEWS ============
document.addEventListener('DOMContentLoaded', () => {
    const reviewInput = document.getElementById('reviewImage');
    if (reviewInput) {
        reviewInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            const preview = document.getElementById('imagePreview');
            files.forEach(file => {
                if (file.size > 5 * 1024 * 1024) { showToast('الصورة كبيرة جداً (الحد الأقصى 5 ميجابايت)'); return; }
                const reader = new FileReader();
                reader.onload = function(event) {
                    reviewImages.push(event.target.result);
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.style.cssText = 'width:70px;height:70px;object-fit:cover;border-radius:10px;margin:4px;border:2px solid var(--primary);';
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        });
    }
});

// ============ RESIZE HANDLER ============
window.addEventListener('resize', () => {
    if (provincesSwiper) {
        const isMobile = window.innerWidth < 1024;
        provincesSwiper.params.navigation = isMobile ? false : { nextEl: '#provinceNext', prevEl: '#provincePrev' };
        provincesSwiper.update();
    }
});

const domObserver = new MutationObserver(() => observeLazyImages());
domObserver.observe(document.getElementById('cityPagesContainer'), { childList: true, subtree: true });

// ============ CONSOLE ============
console.log('🍽️ كول واتهنى - دليل المطاعم في سوريا');
console.log('📊 عدد المطاعم المحملة:', Object.values(allRestaurants).reduce((sum, arr) => sum + arr.length, 0));
console.log('❤️ عدد المفضلة:', favorites.length);
console.log('⭐ عدد النقاط:', userPoints);