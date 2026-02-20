"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const data_source_1 = require("../src/database/data-source");
const product_entity_1 = require("../src/admin/products/entities/product.entity");
const validate_dto_1 = require("../src/admin/products/dto/validate.dto");
const nanoid_1 = require("nanoid");
const nanoid10 = (0, nanoid_1.customAlphabet)('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10);
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w-]/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-+|-+$/g, '');
}
const BRANDS = [
    'Sony', 'Samsung', 'Apple', 'JBL', 'Bose', 'Anker', 'Xiaomi', 'Logitech',
    'Marshall', 'Sennheiser', 'Audio-Technica', 'Jabra', 'Google', 'OnePlus',
    'Oppo', 'Realme', 'Nothing', 'Huawei', 'LG', 'Dell', 'Lenovo', 'ASUS',
    'Acer', 'HP', 'MSI', 'Razer', 'SteelSeries', 'HyperX', 'Corsair',
    'Baseus', 'Ugreen', 'Belkin', 'TP-Link', 'Dyson', 'Garmin', 'Fitbit',
    'Amazfit', 'IKEA', 'Elgato', 'Keychron', 'Akko', 'Topping', 'FiiO',
    'Moondrop', 'Shure', 'Rode', 'DJI', 'GoPro', 'Fujifilm', 'Canon',
];
const CATALOG = [
    {
        category: 'หูฟัง',
        names: [
            '{brand} WH-1000XM6', '{brand} WH-1000XM5', '{brand} WF-1000XM5',
            '{brand} QuietComfort Ultra', '{brand} QuietComfort 45',
            '{brand} Tour One M2', '{brand} Tune Beam', '{brand} Live Pro 2',
            '{brand} Elite 10', '{brand} Elite 8 Active', '{brand} Buds3 Pro',
            '{brand} Galaxy Buds FE', '{brand} AirPods Pro 3',
            '{brand} AirPods Max 2', '{brand} AirPods 4',
            '{brand} ATH-M50xBT2', '{brand} ATH-SR50BT',
            '{brand} Momentum 4', '{brand} Momentum TW4',
            '{brand} HD 660S2', '{brand} IE 600',
            '{brand} Ear (open)', '{brand} Ear (2)',
            '{brand} Space One', '{brand} Soundcore Liberty 4 NC',
            '{brand} Life Q35', '{brand} Major V', '{brand} Minor IV',
            '{brand} Monitor II ANC', '{brand} Motif II ANC',
            '{brand} Chu II', '{brand} Aria 2', '{brand} KATO',
            '{brand} Aonic 50 Gen 2', '{brand} Aonic Free',
            '{brand} Kraken V4', '{brand} Arctis Nova Pro',
            '{brand} Cloud III', '{brand} HS80 RGB',
        ],
        subtitles: [
            'หูฟังครอบหูตัดเสียง ANC ระดับพรีเมียม',
            'หูฟัง TWS ไร้สาย เสียงดี แบตอึด',
            'หูฟังเกมมิ่งเสียงรอบทิศทาง 7.1',
            'In-Ear Monitor คุณภาพสตูดิโอ',
            'หูฟัง Open-back สำหรับนักเพลง',
            'หูฟังออกกำลังกาย กันน้ำ IP67',
            'หูฟังบลูทูธ Hi-Res Audio รองรับ LDAC',
            'หูฟัง ANC + Transparency Mode อัจฉริยะ',
        ],
        priceRange: [590, 18900],
        priceLabels: ['ราคา Shopee', 'ราคา Lazada', 'ราคาตัวแทน', 'ราคาล่าสุด'],
    },
    {
        category: 'ลำโพง',
        names: [
            '{brand} Flip 7', '{brand} Flip 6', '{brand} Charge 5',
            '{brand} Xtreme 4', '{brand} PartyBox 120',
            '{brand} SRS-XB100', '{brand} SRS-XE300', '{brand} SRS-XG500',
            '{brand} Emberton III', '{brand} Stanmore III', '{brand} Acton III',
            '{brand} Kilburn III', '{brand} Woburn III',
            '{brand} SoundLink Flex 2', '{brand} SoundLink Max',
            '{brand} Portable Home Speaker', '{brand} SoundLink Revolve+ II',
            '{brand} Motion 300', '{brand} Soundcore Select 4',
            '{brand} Soundcore Boom 2', '{brand} Mi Speaker',
            '{brand} HomePod Mini', '{brand} HomePod 2',
            '{brand} Nest Audio', '{brand} Pixel Speaker',
            '{brand} Galaxy Home Mini', '{brand} Music Link',
        ],
        subtitles: [
            'ลำโพงบลูทูธพกพา กันน้ำ IP67',
            'ลำโพงปาร์ตี้ เบสหนัก เสียงดัง',
            'ลำโพง Retro ดีไซน์คลาสสิก เสียงอิ่ม',
            'ลำโพง Smart Speaker สั่งงานด้วยเสียง',
            'ลำโพง Hi-Fi สำหรับบ้าน คุณภาพสตูดิโอ',
            'ลำโพง 360 องศา เสียงรอบทิศทาง',
        ],
        priceRange: [690, 15900],
        priceLabels: ['ราคา Shopee', 'ราคา Lazada', 'ราคาตัวแทน', 'ราคาล่าสุด'],
    },
    {
        category: 'สมาร์ทโฟน',
        names: [
            '{brand} Galaxy S26 Ultra', '{brand} Galaxy S26+', '{brand} Galaxy S26',
            '{brand} Galaxy Z Fold 7', '{brand} Galaxy Z Flip 7',
            '{brand} Galaxy A56', '{brand} Galaxy A36',
            '{brand} iPhone 17 Pro Max', '{brand} iPhone 17 Pro',
            '{brand} iPhone 17', '{brand} iPhone SE 4',
            '{brand} Pixel 11 Pro', '{brand} Pixel 11', '{brand} Pixel 11a',
            '{brand} 14 Pro', '{brand} 14', '{brand} 13T Pro',
            '{brand} Find X8 Pro', '{brand} Find X8', '{brand} Find N5',
            '{brand} GT 7 Pro', '{brand} GT 7', '{brand} 14 Pro',
            '{brand} Phone (3)', '{brand} Phone (2a) Plus',
            '{brand} Pura 80 Pro', '{brand} Mate 70 Pro',
            '{brand} Xperia 1 VII', '{brand} Xperia 5 VI',
            '{brand} 15 Ultra', '{brand} 15 Pro', '{brand} 15',
            '{brand} Redmi Note 15 Pro+', '{brand} Redmi K80',
        ],
        subtitles: [
            'เรือธงกล้อง 200MP ชิป Snapdragon 8 Elite',
            'สมาร์ทโฟนจอพับรุ่นใหม่ล่าสุด',
            'มือถือสาย Camera ถ่ายสวยทุกสถานการณ์',
            'มือถือราคาคุ้ม สเปกดีเกินราคา',
            'สมาร์ทโฟน AI อัจฉริยะในทุกฟีเจอร์',
            'มือถือเกมมิ่ง ชิปแรง จอลื่น 144Hz',
            'มือถือแบตอึด ใช้ได้ 2 วันเต็ม',
        ],
        priceRange: [4990, 59900],
        priceLabels: ['ราคา AIS', 'ราคา True', 'ราคา Shopee', 'ราคาศูนย์'],
    },
    {
        category: 'แล็ปท็อป',
        names: [
            '{brand} MacBook Air M4', '{brand} MacBook Pro M4 Pro',
            '{brand} MacBook Pro M4 Max', '{brand} XPS 16 (2026)',
            '{brand} XPS 14 (2026)', '{brand} XPS 13 Plus',
            '{brand} ThinkPad X1 Carbon Gen 13', '{brand} Yoga Pro 9i',
            '{brand} IdeaPad Slim 5', '{brand} Legion Pro 7i',
            '{brand} ROG Zephyrus G16', '{brand} ROG Strix G16',
            '{brand} ZenBook S16', '{brand} Vivobook Pro 15',
            '{brand} Swift Go 14', '{brand} Predator Helios 16',
            '{brand} Spectre x360 14', '{brand} Pavilion Plus 16',
            '{brand} Creator Z17', '{brand} Stealth 18',
            '{brand} Raider 18 HX', '{brand} Blade 16 (2026)',
            '{brand} Blade 14 (2026)', '{brand} Book Air 14',
            '{brand} Book Pro 16', '{brand} MateBook X Pro (2026)',
            '{brand} Galaxy Book 5 Pro', '{brand} Galaxy Book 5 Ultra',
            '{brand} Gram 17 (2026)', '{brand} Gram Pro 16',
        ],
        subtitles: [
            'อัลตร้าบุ๊กบางเบา สำหรับทำงานทุกที่',
            'แล็ปท็อปเกมมิ่ง RTX 5080 จอ 240Hz',
            'โน้ตบุ๊กสาย Creative งาน Video/3D',
            'แล็ปท็อป 2-in-1 จอสัมผัส OLED',
            'โน้ตบุ๊กทำงาน แบตอึด 20 ชม.',
            'แล็ปท็อปนักเรียน สเปกดีราคาเข้าถึง',
        ],
        priceRange: [15900, 89900],
        priceLabels: ['ราคา JIB', 'ราคา Banana IT', 'ราคาศูนย์', 'ราคา Shopee'],
    },
    {
        category: 'สมาร์ทวอทช์',
        names: [
            '{brand} Watch Ultra 3', '{brand} Watch Series 11',
            '{brand} Watch SE 3', '{brand} Galaxy Watch 7 Ultra',
            '{brand} Galaxy Watch 7', '{brand} Galaxy Watch FE 2',
            '{brand} Pixel Watch 4', '{brand} Pixel Watch 4 XL',
            '{brand} Forerunner 265', '{brand} Forerunner 965',
            '{brand} Fenix 8', '{brand} Venu 3S',
            '{brand} Sense 3', '{brand} Charge 7',
            '{brand} T-Rex Ultra 2', '{brand} GTR 5 Pro',
            '{brand} GTS 5', '{brand} Band 9 Pro',
            '{brand} Watch GT 5 Pro', '{brand} Watch Fit 4',
            '{brand} Smart Band 9 Pro', '{brand} Watch S4',
            '{brand} Watch 2 Pro', '{brand} Band Pro',
        ],
        subtitles: [
            'สมาร์ทวอทช์ GPS วัดสุขภาพครบทุกค่า',
            'นาฬิกาออกกำลังกาย วัด SpO2 + ECG',
            'สมาร์ทวอทช์ทนทาน Sapphire Crystal กันน้ำ 100m',
            'สมาร์ทแบนด์ราคาเบาจอ AMOLED สีสด',
            'นาฬิกาวิ่ง GPS Multi-band แม่นยำสูง',
        ],
        priceRange: [990, 32900],
        priceLabels: ['ราคา Shopee', 'ราคา Lazada', 'ราคาศูนย์', 'ราคาล่าสุด'],
    },
    {
        category: 'แท็บเล็ต',
        names: [
            '{brand} iPad Pro M4 13"', '{brand} iPad Air M3',
            '{brand} iPad Mini 7', '{brand} iPad 11',
            '{brand} Galaxy Tab S10 Ultra', '{brand} Galaxy Tab S10+',
            '{brand} Galaxy Tab S10 FE', '{brand} Galaxy Tab A10',
            '{brand} Pixel Tablet 2', '{brand} Tab P12 Pro',
            '{brand} Tab M11', '{brand} Pad 7 Pro',
            '{brand} Pad SE', '{brand} Redmi Pad Pro 2',
            '{brand} MatePad Pro 13.2', '{brand} MatePad Air 12',
        ],
        subtitles: [
            'แท็บเล็ตจอ OLED สำหรับวาดรูป + โน้ต',
            'แท็บเล็ตทำงาน ใช้แทนโน้ตบุ๊กได้',
            'แท็บเล็ตบันเทิง จอใหญ่ดู Netflix สบาย',
            'แท็บเล็ตเรียนหนังสือ ราคานักเรียน',
        ],
        priceRange: [5990, 54900],
        priceLabels: ['ราคา Shopee', 'ราคา JIB', 'ราคาศูนย์', 'ราคาล่าสุด'],
    },
    {
        category: 'อุปกรณ์ชาร์จ',
        names: [
            '{brand} Nano II 65W', '{brand} Prime 100W GaN',
            '{brand} 737 Power Bank 24K', '{brand} MagGo 10K',
            '{brand} 523 Power Bank', '{brand} PowerPort III 3-Port',
            '{brand} 67W GaN Charger', '{brand} 120W HyperCharge',
            '{brand} 45W Travel Adapter', '{brand} Nexode 100W',
            '{brand} Nexode Pro 160W', '{brand} 100W 4-Port Desktop',
            '{brand} BoostCharge Pro 3-in-1', '{brand} MagSafe Charger',
            '{brand} USB-C 240W Cable', '{brand} Thunderbolt 5 Cable',
            '{brand} 25000mAh Solar Bank', '{brand} Magnetic Wireless Pad',
            '{brand} Car Charger 67W', '{brand} Desktop GaN Station',
        ],
        subtitles: [
            'ที่ชาร์จ GaN ขนาดเล็ก ชาร์จเร็ว',
            'พาวเวอร์แบงค์ชาร์จเร็ว PD 3.1',
            'แท่นชาร์จไร้สาย MagSafe 3-in-1',
            'สายชาร์จ USB-C 240W ทนทาน',
            'ชุดชาร์จในรถ Fast Charge',
        ],
        priceRange: [190, 4990],
        priceLabels: ['ราคา Shopee', 'ราคา Lazada', 'ราคาล่าสุด'],
    },
    {
        category: 'อุปกรณ์เสริมโต๊ะ',
        names: [
            '{brand} MX Master 3S', '{brand} MX Anywhere 3S',
            '{brand} MX Keys S', '{brand} MX Ergo S',
            '{brand} Lift for Mac', '{brand} K380s Keyboard',
            '{brand} Q1 Max', '{brand} Q3 Pro', '{brand} K8 Pro',
            '{brand} V2 Keyboard', '{brand} K2 Keyboard',
            '{brand} DeathAdder V3 Pro', '{brand} Viper V3 HyperSpeed',
            '{brand} Aerox 5', '{brand} Rival 5',
            '{brand} Sabre RGB Pro', '{brand} K70 Max',
            '{brand} Wave Keys', '{brand} Stream Deck +',
            '{brand} Stream Deck Neo', '{brand} Key Light Air',
            '{brand} PEGBOARD 76x56', '{brand} BEKANT Desk 160',
            '{brand} Monitor Arm LX', '{brand} Desk Mat XL',
        ],
        subtitles: [
            'เมาส์เออร์โกโนมิก ใช้ทำงานทั้งวันสบาย',
            'คีย์บอร์ด Mechanical ไร้สาย Hot-swap',
            'อุปกรณ์จัดโต๊ะทำงาน เพิ่มประสิทธิภาพ',
            'เมาส์เกมมิ่ง เซ็นเซอร์ 30K DPI',
            'อุปกรณ์สตรีมเมอร์ ควบคุมด้วยปุ่มเดียว',
        ],
        priceRange: [590, 12900],
        priceLabels: ['ราคา Shopee', 'ราคา JIB', 'ราคา Lazada', 'ราคาล่าสุด'],
    },
    {
        category: 'กล้อง',
        names: [
            '{brand} X-T50', '{brand} X-S20', '{brand} X100VI',
            '{brand} GFX 100S II', '{brand} EOS R5 II',
            '{brand} EOS R6 III', '{brand} EOS R50',
            '{brand} Alpha 7C II', '{brand} Alpha 7R V',
            '{brand} ZV-E10 II', '{brand} ZV-1 II',
            '{brand} Action 5 Pro', '{brand} Mini 5',
            '{brand} Mavic 4 Pro', '{brand} Osmo Pocket 4',
            '{brand} Hero 14 Black', '{brand} Hero 14 Mini',
        ],
        subtitles: [
            'กล้อง Mirrorless เซ็นเซอร์ APS-C สีสวย',
            'กล้อง Vlog ออโต้โฟกัสเร็ว จอพับได้',
            'กล้อง Full-frame สำหรับมืออาชีพ',
            'กล้อง Action Cam 4K 120fps',
            'โดรนถ่ายภาพ 8K Hasselblad Camera',
        ],
        priceRange: [8990, 89900],
        priceLabels: ['ราคา Big Camera', 'ราคา Fotofile', 'ราคาศูนย์', 'ราคาล่าสุด'],
    },
    {
        category: 'เครื่องใช้ในบ้าน',
        names: [
            '{brand} Purifier Big Quiet+', '{brand} Purifier Hot+Cool',
            '{brand} V15 Detect Absolute', '{brand} Supersonic Nural',
            '{brand} Airwrap i.d.', '{brand} Robot Vacuum X20+',
            '{brand} Robot Vacuum S20+', '{brand} Air Purifier 4 Pro',
            '{brand} Smart Fan 2', '{brand} Smart Humidifier 2',
            '{brand} LED Desk Lamp Pro', '{brand} LED Strip 2',
            '{brand} Smart Plug Wi-Fi', '{brand} Tapo C220',
            '{brand} Deco XE75 Pro', '{brand} Smart Display 10',
        ],
        subtitles: [
            'เครื่องฟอกอากาศ ห้อง 50 ตร.ม. กรอง PM2.5',
            'หุ่นยนต์ดูดฝุ่นอัจฉริยะ ถูพื้นในตัว',
            'เครื่องดูดฝุ่นไร้สาย เลเซอร์ตรวจจับฝุ่น',
            'ไดร์เป่าผม สไตล์มืออาชีพที่บ้าน',
            'ไฟ LED อัจฉริยะ ปรับสีได้ 16 ล้านสี',
            'กล้องวงจรปิดอัจฉริยะ AI ตรวจจับคน',
        ],
        priceRange: [490, 29900],
        priceLabels: ['ราคา Shopee', 'ราคา Lazada', 'ราคา Power Buy', 'ราคาล่าสุด'],
    },
];
const BRAND_TO_CATEGORIES = {
    Sony: [0, 1, 2, 8],
    Samsung: [0, 2, 4, 5],
    Apple: [0, 1, 2, 3, 4, 5],
    JBL: [0, 1],
    Bose: [0, 1],
    Anker: [0, 6],
    Xiaomi: [0, 2, 4, 6, 9],
    Logitech: [7],
    Marshall: [0, 1],
    Sennheiser: [0],
    'Audio-Technica': [0],
    Jabra: [0],
    Google: [2, 4, 5],
    OnePlus: [0, 2],
    Oppo: [2],
    Realme: [2],
    Nothing: [0, 2],
    Huawei: [2, 4, 5],
    LG: [3, 9],
    Dell: [3],
    Lenovo: [3, 5],
    ASUS: [3, 7],
    Acer: [3],
    HP: [3],
    MSI: [3],
    Razer: [0, 3, 7],
    SteelSeries: [0, 7],
    HyperX: [0, 7],
    Corsair: [0, 7],
    Baseus: [6],
    Ugreen: [6],
    Belkin: [6],
    'TP-Link': [9],
    Dyson: [9],
    Garmin: [4],
    Fitbit: [4],
    Amazfit: [4],
    IKEA: [7, 9],
    Elgato: [7],
    Keychron: [7],
    Akko: [7],
    Topping: [0],
    FiiO: [0],
    Moondrop: [0],
    Shure: [0],
    Rode: [7],
    DJI: [8],
    GoPro: [8],
    Fujifilm: [8],
    Canon: [8],
};
function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const rand = mulberry32(20260220);
function pick(arr) {
    return arr[Math.floor(rand() * arr.length)];
}
function randInt(min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
}
function roundToNearest(n, step) {
    return Math.round(n / step) * step;
}
function randomDate(startStr, endStr) {
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    const d = new Date(start + rand() * (end - start));
    return d.toISOString().split('T')[0];
}
function generateProduct(index) {
    const brand = pick(BRANDS);
    const allowedCats = BRAND_TO_CATEGORIES[brand] ?? [0];
    const catIdx = pick(allowedCats);
    const tpl = CATALOG[catIdx];
    let nameTemplate = pick(tpl.names);
    const name = nameTemplate.replace('{brand}', brand);
    const slug = `${slugify(name)}-${index}`;
    const subtitle = pick(tpl.subtitles);
    const rawPrice = randInt(tpl.priceRange[0], tpl.priceRange[1]);
    const price = roundToNearest(rawPrice, 10);
    const overallScore = Number(Math.min(9.8, Math.max(3.0, 6.0 + (rand() - 0.3) * 5)).toFixed(1));
    const isRecommended = overallScore >= 7.5 && rand() > 0.4;
    const priceLabel = pick(tpl.priceLabels);
    const hasAffiliate = rand() > 0.6;
    const affiliateLink = hasAffiliate
        ? `https://s.shopee.co.th/${nanoid10()}`
        : null;
    const lastUpdated = randomDate('2025-08-01', '2026-02-20');
    const status = rand() > 0.1 ? validate_dto_1.ProductStatus.PUBLISHED : validate_dto_1.ProductStatus.DRAFT;
    return {
        id: nanoid10(),
        slug,
        name,
        subtitle,
        image: null,
        overallScore,
        isRecommended,
        price,
        currency: 'THB',
        priceLabel,
        affiliateLink,
        lastUpdated,
        status,
        categoryId: null,
        brandId: null,
    };
}
async function seedProducts(total = 10000, batchSize = 1000) {
    await data_source_1.AppDataSource.initialize();
    const repo = data_source_1.AppDataSource.getRepository(product_entity_1.Product);
    console.log(`🌱 Seeding ${total} products in batches of ${batchSize}...`);
    const t0 = Date.now();
    for (let start = 1; start <= total; start += batchSize) {
        const batch = [];
        for (let i = start; i < start + batchSize && i <= total; i++) {
            batch.push(generateProduct(i));
        }
        await repo.insert(batch);
        const done = Math.min(start + batchSize - 1, total);
        console.log(`  ✅ ${done.toLocaleString()}/${total.toLocaleString()}`);
    }
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`\n🎉 Done! ${total.toLocaleString()} products seeded in ${elapsed}s`);
    await data_source_1.AppDataSource.destroy();
}
seedProducts(10000, 1000).catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
});
//# sourceMappingURL=seed-product.js.map