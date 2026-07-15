// ============================================================
// ============ DATA FILE ======================================
// ============================================================

// ============ PROVINCES ============
const provinces = ["دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس", "دير الزور", "الحسكة", "الرقة", "إدلب", "السويداء", "درعا", "القنيطرة"];

const cuisineTypes = ['مشاوي', 'مأكولات بحرية', 'بيتزا وباستا', 'برغر', 'مطبخ شرقي', 'مطبخ غربي', 'حلويات', 'مقبلات', 'أكلات شعبية', 'بوفيه مفتوح', 'سوشي', 'شاورما', 'فطور', 'عصائر', 'قهوة', 'ساندويش', 'وجبات سريعة', 'مخبوزات', 'مطبخ تركي', 'مطبخ عالمي', 'مطبخ إيطالي', 'مطبخ أمريكي'];

const imagePool = [
    'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
    'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
];

const provinceIcons = {
    'دمشق': 'landmark', 'ريف دمشق': 'tree', 'حلب': 'city', 'حمص': 'industry',
    'حماة': 'water', 'اللاذقية': 'umbrella-beach', 'طرطوس': 'ship',
    'دير الزور': 'bridge', 'الحسكة': 'mountain', 'الرقة': 'mosque',
    'إدلب': 'leaf', 'السويداء': 'gem', 'درعا': 'fort-awesome', 'القنيطرة': 'hill-rockslide'
};

const provinceImages = {
    'دمشق': 'https://imgur.com/qxbKmUp.jpg', 'ريف دمشق': 'https://imgur.com/JuyiJQI.jpg',
    'حلب': 'https://imgur.com/CIQfzQe.jpg', 'حمص': 'https://imgur.com/OSJci2j.jpg',
    'حماة': 'https://imgur.com/8bAdiEp.jpg', 'اللاذقية': 'https://imgur.com/nvTadsG.jpg',
    'طرطوس': 'https://imgur.com/tzXN4rF.jpg', 'دير الزور': 'https://imgur.com/PAywOu1.jpg',
    'الحسكة': 'https://imgur.com/xhhxnjH.jpg', 'الرقة': 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&h=400&fit=crop',
    'إدلب': 'https://imgur.com/J6rg244.jpg', 'السويداء': 'https://imgur.com/iEa5b0S.jpg',
    'درعا': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop',
    'القنيطرة': 'https://imgur.com/QlsJK5A.jpg'
};

const provinceInfo = {
    'دمشق': { desc: 'أقدم عاصمة مأهولة في التاريخ، قلب العالم العربي النابض.', famous: 'الجامع الأموي، سوق الحميدية' },
    'ريف دمشق': { desc: 'تحيط بالعاصمة وتضم أجمل المصايف والقرى.', famous: 'معلولا، الزبداني، دوما، جرمانا، داريا، قدسيا' },
    'حلب': { desc: 'العاصمة الاقتصادية لسوريا، قلعتها الشهيرة.', famous: 'قلعة حلب، السوق المسقوف' },
    'حمص': { desc: 'ثالث أكبر مدينة، بوابة الشمال.', famous: 'قلعة الحصن، جامع خالد بن الوليد' },
    'حماة': { desc: 'مدينة النواعير على نهر العاصي.', famous: 'النواعير، نهر العاصي' },
    'اللاذقية': { desc: 'عروس الساحل السوري على البحر المتوسط.', famous: 'شاطئ الكورنيش، أوغاريت' },
    'طرطوس': { desc: 'لؤلؤة المتوسط، جزيرة أرواد.', famous: 'جزيرة أرواد، كاتدرائية طرطوس' },
    'دير الزور': { desc: 'واحة الفرات الخضراء.', famous: 'الجسر المعلق، نهر الفرات' },
    'الحسكة': { desc: 'سلة غذاء سوريا، أرض الجزيرة.', famous: 'نهر الخابور، تل حلف' },
    'الرقة': { desc: 'عاصمة الرشيد التاريخية.', famous: 'قصر البنات، بحيرة الأسد' },
    'إدلب': { desc: 'أرض الزيتون والطبيعة.', famous: 'مملكة إيبلا، بساتين الزيتون' },
    'السويداء': { desc: 'جبل العرب، أرض الكروم.', famous: 'آثار شهبا، جبل العرب' },
    'درعا': { desc: 'مهد الثورة العربية الكبرى.', famous: 'مدرج بصرى، بصرى الشام' },
    'القنيطرة': { desc: 'مرتفعات الجولان الخضراء.', famous: 'غابات الجولان، نبع بانياس' }
};

const provinceCoords = {
    'دمشق': { lat: 33.5138, lng: 36.2765 }, 'ريف دمشق': { lat: 33.5, lng: 36.3 },
    'حلب': { lat: 36.2021, lng: 37.1343 }, 'حمص': { lat: 34.7321, lng: 36.7105 },
    'حماة': { lat: 35.135, lng: 36.7514 }, 'اللاذقية': { lat: 35.531, lng: 35.7909 },
    'طرطوس': { lat: 34.889, lng: 35.886 }, 'دير الزور': { lat: 35.338, lng: 40.144 },
    'الحسكة': { lat: 36.511, lng: 40.743 }, 'الرقة': { lat: 35.959, lng: 39.018 },
    'إدلب': { lat: 35.933, lng: 36.633 }, 'السويداء': { lat: 32.706, lng: 36.569 },
    'درعا': { lat: 32.624, lng: 36.102 }, 'القنيطرة': { lat: 33.124, lng: 35.823 }
};

// ============ DAMASCUS REAL RESTAURANTS ============
const damascusRealRestaurants = [
    {id:"r1",name:"مطعم دهب",cuisine:"مطبخ شرقي",rating:4.5,priceRange:"$$$",priceLevel:3,description:"من أشهر وأفخم مطاعم دمشق، يقدم ألذ المأكولات الشرقية والمشاوي بأجواء راقية.",address:"دمشق - المالكي",phone:"0113732527",lat:33.5190,lng:36.2785,openingHours:"11:00 صباحاً - 12:00 منتصف الليل"},
    {id:"r2",name:"مطعم HUQQABAZ",cuisine:"مطبخ شرقي",rating:4.3,priceRange:"$$$",priceLevel:3,description:"مطعم راقي في منطقة المالكي، يقدم أشهى الأطباق الشرقية والعالمية.",address:"دمشق - المالكي",phone:"0934100015",lat:33.5185,lng:36.2790,openingHours:"10:00 صباحاً - 11:00 مساءً"},
    {id:"r3",name:"مطعم Ammoula",cuisine:"مطبخ شرقي",rating:4.4,priceRange:"$$",priceLevel:2,description:"مطعم دافئ يقدم ألذ المأكولات البيتية والشرقية في المالكي.",address:"دمشق - المالكي",phone:"0935808487",lat:33.5178,lng:36.2800,openingHours:"9:00 صباحاً - 10:00 مساءً"},
    {id:"r4",name:"عصير تايم",cuisine:"عصائر",rating:4.2,priceRange:"$",priceLevel:1,description:"أفضل مكان للعصائر الطازجة والحلويات الباردة في دمشق.",address:"دمشق - المالكي",phone:"0983000559",lat:33.5180,lng:36.2780,openingHours:"8:00 صباحاً - 12:00 منتصف الليل"},
    {id:"r5",name:"مطعم فابيان Fabian",cuisine:"مطبخ غربي",rating:4.6,priceRange:"$$$",priceLevel:3,description:"مطعم إيطالي راقي في المهاجرين، يقدم الباستا والبيتزا الأصيلة.",address:"دمشق - المهاجرين",phone:"0113712200",lat:33.5205,lng:36.2750,openingHours:"11:00 صباحاً - 11:00 مساءً"},
    {id:"r6",name:"Pizza Hot",cuisine:"بيتزا وباستا",rating:4.1,priceRange:"$$",priceLevel:2,description:"بيتزا ساخنة ولذيذة في المالكي، توصيل سريع وخدمة ممتازة.",address:"دمشق - المالكي",phone:"0113738964",lat:33.5175,lng:36.2810,openingHours:"10:00 صباحاً - 1:00 بعد منتصف الليل"},
    {id:"r7",name:"Farouk Snax",cuisine:"برغر",rating:4.0,priceRange:"$$",priceLevel:2,description:"أشهى السناكس والبرغر في المالكي، مكان مثالي للوجبات السريعة.",address:"دمشق - المالكي",phone:"0113739115",lat:33.5170,lng:36.2795,openingHours:"9:00 صباحاً - 11:00 مساءً"},
    {id:"r8",name:"خبز وجبنة",cuisine:"أكلات شعبية",rating:4.3,priceRange:"$",priceLevel:1,description:"ألذ الفطائر والمعجنات الطازجة في المالكي.",address:"دمشق - المالكي",phone:"0113733743",lat:33.5173,lng:36.2805,openingHours:"7:00 صباحاً - 10:00 مساءً"},
    {id:"r9",name:"مطعم Butterfly",cuisine:"مطبخ غربي",rating:4.2,priceRange:"$$",priceLevel:2,description:"مطعم جميل في المالكي، ديكورات رائعة وأطباق لذيذة.",address:"دمشق - المالكي",phone:"0955355555",lat:33.5188,lng:36.2808,openingHours:"10:00 صباحاً - 11:00 مساءً"},
    {id:"r10",name:"مطعم LA Fayette",cuisine:"مطبخ غربي",rating:4.5,priceRange:"$$$$",priceLevel:4,description:"من أفخم مطاعم المالكي، يقدم أشهى الأطباق الفرنسية والعالمية.",address:"دمشق - المالكي",phone:"0113739994",lat:33.5192,lng:36.2815,openingHours:"12:00 ظهراً - 12:00 منتصف الليل"},
    // ... (يمكنك إكمال بقية البيانات)
];

// ============ RIF DIMASHQ REAL RESTAURANTS ============
const rifDimashqRealRestaurants = [
    {id:"rd1",name:"سناك الكنغ",cuisine:"وجبات سريعة",rating:4.2,priceRange:"$",priceLevel:1,description:"أشهر سناك في ريف دمشق، يقدم وجبات سريعة لذيذة.",address:"ريف دمشق - دوما",phone:"+963985902020",lat:33.57,lng:36.40,openingHours:"10:00 صباحاً - 12:00 منتصف الليل"},
    {id:"rd2",name:"مطعم باشكا",cuisine:"مطبخ شرقي",rating:4.4,priceRange:"$$",priceLevel:2,description:"مطعم شرقي مميز يقدم أشهى المأكولات الشرقية والمشاوي.",address:"ريف دمشق - جرمانا",phone:"+963116711936",lat:33.48,lng:36.34,openingHours:"11:00 صباحاً - 11:00 مساءً"},
    // ... (يمكنك إكمال بقية البيانات)
];

// ============ ARTICLES ============
const articles = [
    {
        id: 1,
        title: "تاريخ الكبة السورية: من التراث إلى العالمية",
        description: "رحلة الكبة عبر العصور السورية، من أقدم الوصفات إلى أشهر المطاعم.",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
        author: "كول واتهنى",
        date: "2026-06-20",
        category: "تراث",
        content: "الكبة السورية هي أحد أشهر الأطباق في المطبخ العربي والعالمي..."
    },
    {
        id: 2,
        title: "سر الشاورما السورية: الطريقة الأصلية",
        description: "تعرف على أسرار تحضير الشاورما السورية الأصيلة في المنزل.",
        image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
        author: "كول واتهنى",
        date: "2026-06-18",
        category: "وصفات",
        content: "الشاورما السورية لها نكهة خاصة لا مثيل لها..."
    },
    {
        id: 3,
        title: "دليل الحلويات السورية الشهيرة",
        description: "أشهر الحلويات السورية من البقلاوة إلى الكنافة والمبرومة.",
        image: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg",
        author: "كول واتهنى",
        date: "2026-06-15",
        category: "حلويات",
        content: "تتميز الحلويات السورية بجودتها العالية ومذاقها الفريد..."
    },
    {
        id: 4,
        title: "أفضل مطاعم دمشق التقليدية",
        description: "جولة في أقدم وأشهر مطاعم دمشق التي حافظت على أصالة الطبخ.",
        image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
        author: "كول واتهنى",
        date: "2026-06-12",
        category: "دليلك",
        content: "دمشق مدينة تعج بالمطاعم التقليدية التي تحافظ على التراث..."
    }
];

// ============ GENERATE RESTAURANTS ============
const restaurantNames = ['أبو السعد', 'الديار', 'الفردوس', 'القصر', 'الزهرة', 'النجمة', 'البستان', 'النخيل', 'سهارى', 'ليالي', 'ألف ليلة', 'بوابة الشام', 'جبل العرب', 'باب توما', 'المأذنة', 'القلعة', 'البارون', 'شهرزاد', 'ميراج', 'رويال', 'جراند', 'بلازا', 'فاخر', 'مشاوي العاصمة', 'سمك وشوي', 'طازج', 'سوريانا'];
const adjectives = ['الذهبي', 'الفضي', 'التراثي', 'الحديث', 'الفاخر', 'الرائع', 'المميز', 'الحصري'];

function generateRestaurants(province, count = 50) {
    const realData = {
        'دمشق': damascusRealRestaurants,
        'ريف دمشق': rifDimashqRealRestaurants
    };
    
    if (realData[province]) {
        return realData[province].map(r => ({
            ...r,
            image: imagePool[Math.floor(Math.random() * imagePool.length)] + `?w=600&h=400&random=${Math.random()}`,
            reviews: [],
            views: 0
        }));
    }
    
    const restaurants = [];
    const coords = provinceCoords[province] || { lat: 33.5, lng: 36.3 };
    for (let i = 0; i < count; i++) {
        const randomName = restaurantNames[Math.floor(Math.random() * restaurantNames.length)];
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const cuisine = cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)];
        const rating = (3.5 + Math.random() * 1.5);
        const priceLevel = Math.floor(Math.random() * 4) + 1;
        const priceRange = ['$', '$$', '$$$', '$$$$'][priceLevel - 1];
        const hourStart = Math.floor(Math.random() * 6 + 8);
        const hourEnd = Math.floor(Math.random() * 6 + 20);
        restaurants.push({
            id: `${province}_${i}`,
            name: `${randomName} ${randomAdj}`,
            cuisine, rating: parseFloat(rating.toFixed(1)), priceRange, priceLevel,
            description: `✨ أحد أرقى مطاعم ${province}، يقدم ألذ المأكولات ${cuisine} بأجواء راقية وخدمة ممتازة.`,
            address: `${province} - شارع ${['الفرنسي', 'بغداد', 'الجامعة', 'الصالحية', 'المالكي', 'الشام', 'العروبة'][Math.floor(Math.random()*7)]}`,
            phone: `09${Math.floor(Math.random() * 9000000 + 1000000)}`,
            image: imagePool[Math.floor(Math.random() * imagePool.length)] + `?w=600&h=400&random=${i}`,
            openingHours: `${hourStart}:00 صباحاً - ${hourEnd}:00 مساءً`,
            hourStart, hourEnd,
            lat: coords.lat + (Math.random() - 0.5) * 0.08,
            lng: coords.lng + (Math.random() - 0.5) * 0.08,
            reviews: [],
            views: 0
        });
    }
    return restaurants;
}

// ============ Initialize allRestaurants ============
let allRestaurants = {};
provinces.forEach(p => { allRestaurants[p] = generateRestaurants(p, 50); });

// ============ ADD "شوّاب" RESTAURANT ============
const shawabRestaurant = {
    id: "shawab_syria",
    name: "شوّاب",
    cuisine: "مطبخ شرقي",
    rating: 4.8,
    priceRange: "$$$",
    priceLevel: 3,
    description: "أحد أشهر المطاعم في سوريا، يقدم أشهى المأكولات الشرقية والمشاوي بأجواء سورية أصيلة.",
    address: "سوريا",
    phone: "+963 11 1234567",
    image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
    openingHours: "10:00 صباحاً - 12:00 منتصف الليل",
    hourStart: 10,
    hourEnd: 24,
    lat: 33.5138,
    lng: 36.2765,
    reviews: [{ rating: 5, text: "أجمل مطعم في سوريا، طعم لا يُقاوم!", date: "2026-02-15", user: "أحمد" }],
    views: 9999
};

// Insert Shawab restaurant at the beginning of Damascus list
if (allRestaurants['دمشق']) {
    const exists = allRestaurants['دمشق'].some(r => r.id === 'shawab_syria');
    if (!exists) {
        allRestaurants['دمشق'].unshift(shawabRestaurant);
    }
}