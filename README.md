# 🚑 إيليت كير للإسعاف — Elite Care Ambulance

موقع إسعاف خاص احترافي مُحسَّن لمحركات البحث، متجاوب، وجاهز للنشر.

---

## 📁 هيكل المشروع

```
elite-care-ambulance/
├── index.html              ← HTML نظيف وسيمانتيكي
├── vercel.json             ← إعدادات Vercel + Security Headers
├── .gitignore
├── README.md
│
├── css/
│   ├── base.css            ← Variables · Reset · Typography · Shared Buttons
│   ├── animations.css      ← Keyframes · Scroll Reveal · Stagger Classes
│   ├── components.css      ← كل المكونات (Navbar, Hero, Services, Modal…)
│   └── responsive.css      ← Media Queries (960px · 768px · 480px)
│
├── js/
│   ├── location.js         ← GPS + Fallback + WhatsApp Message Builder
│   ├── modal.js            ← Emergency Modal (open/close/submit/focus-trap)
│   ├── animations.js       ← Cursor · Progress Bar · Navbar · IntersectionObserver · Counter
│   └── main.js             ← FAQ Accordion + Page Init
│
└── assets/
    ├── images/
    │   ├── logo.webp       ← شعار الشركة
    │   ├── white.webp       ← صورة السيارة البيضاء (hero watermark)
    │   ├── red.png         ← صورة السيارة الحمراء
    │   └── og-cover.jpg    ← صورة Open Graph للسوشيال ميديا
    └── icons/
        └── favicon.ico     ← أيقونة الموقع
```

---
```bash
npm i -g vercel
vercel --prod
```

### الطريقة الثانية — عبر GitHub
1. ارفع المشروع على GitHub
2. افتح [vercel.com](https://vercel.com) → Import Project
3. اختر الـ repo → Deploy

---

## ⚙️ إعدادات Vercel

ملف `vercel.json` يتضمن:
- **Security Headers** (XSS, Clickjacking, MIME sniffing)
- **Cache Control** — CSS/JS/Assets تُخزَّن لمدة سنة (immutable)
- **index.html** — لا يُخزَّن مؤقتًا (must-revalidate)
- **Permissions-Policy** — تصريح الـ Geolocation للموقع فقط

---

## 🖼️ الصور المطلوبة

ضع هذه الملفات في `assets/images/`:

| الملف | الوصف | الأبعاد المقترحة |
|---|---|---|
| `logo.webp` | شعار إيليت كير | 200×200 px |
| `white.webp` | السيارة البيضاء | 1320×800 px |
| `red.png` | السيارة الحمراء | 1320×800 px |
| `og-cover.jpg` | صورة السوشيال | 1200×630 px |

---

## ✅ الميزات

| الميزة | الحالة |
|---|---|
| تحسين SEO (Meta, OG, JSON-LD, Schema.org) | ✅ |
| نظام الطوارئ مع GPS + fallback يدوي | ✅ |
| موودال طلب الإسعاف مع إرسال WhatsApp | ✅ |
| تحريكات Scroll Reveal + Stats Counter | ✅ |
| FAQ Accordion (Accessible) | ✅ |
| Custom Cursor (desktop) | ✅ |
| Sticky Mobile Bar | ✅ |
| Floating CTA Button | ✅ |
| `prefers-reduced-motion` | ✅ |
| Focus Trap في الموودال | ✅ |
| ARIA labels كاملة | ✅ |
| Mobile-first Responsive | ✅ |
| iOS safe-area-inset | ✅ |
| Security Headers | ✅ |
| Cache Optimization | ✅ |

---

## 📞 معلومات التواصل

- **هاتف:** 01060349212
- **واتساب:** 01111456662
- **إيميل:** elite.care.ambulance1@gmail.com

---

## 👨‍💻 تطوير

Built by **Yahya Al-Sulami** — [Yahya.Dev](https://yehiahwary0-oss.github.io/my-portfolio/)
