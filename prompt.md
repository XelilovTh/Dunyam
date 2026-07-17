
Sən dünya səviyyəli veb dizayner və frontend mühəndisisən. Aşağıda təsvir olunan
"Dünyamız" adlı şəxsi sevgi/xatirə veb-saytını (PWA) TAMAMILƏ SIFIRDAN YAZ.
Kod artıq yoxdur — hər şeyi təmiz, peşəkar və işlək şəkildə qur.

## 1. LAYİHƏ
- Ad: Dünyamız (azərbaycanca "Bizim Dünya").
- Mahiyyət: Fidan & Təhmaz üçün şəxsi romantik xatirə saytı.
  Şəkillər, musiqilər, məktublar, sürpriz səhifələr və sevgiliyə ünvanlanmış
  xüsusi mesajlar saxlanılır.
- Auditoriya: yalnız 2 nəfər (cüt). Giriş parolu ilə qorunur.
- Dil: Azərbaycanca (az). Bütün UI mətnləri azərbaycanca olmalı.
- Ton: romantik, emosional, zərif, premium, "wow" effekti.

## 2. TEXNOLOGİYA STEKI (məsləhət: eynisini tətbiq et, sadə və etibarlı)
- Frontend: vanilla HTML + CSS + JavaScript. Framework YOX (React/Vue lazımsız,
  sayt kiçik və statik-hostludur).
- Hosting: Vercel. "vercel.json" ilə serverless funksiya routing-i.
- PWA: manifest.json + service worker (sw.js), network-first keş.
- Yaddaş:
    · Şəkillər və musiqilər: Cloudinary (iki ayrı account: şəkillər + musiqilər).
      Frontend birbaşa Cloudinary upload_preset ilə yükləyir.
    · Mətn və JSON siyahılar: GitHub repo "XelilovTh/Dunyam" — fayllar
      GitHub Contents API ilə (base64) yazılır/oxunur.
      Siyahılar: photos_list.json, music_list.json, blocked_ips.json.
      Məktublar: letters/ qovluğunda .txt fayllar.
- Backend (Vercel Serverless):
    · api/proxy.js — GitHub/Cloudinary/Telegram üçün təhlükəsiz proxy
      (sirlər env-də, CORS idarə olunur, IP-blok yoxlaması buradadır).
    · api/bot.js — Telegram webhook (bot şəkil/musiqi qəbul edir, GitHub-a
      məktub yazır, admin IP bloklayır).
- Sirrlər: .env (GH_TOKEN, TG_TOKEN, CL_*, ADMIN_PASSWORD). .gitignore-da.
- Fontlar: Google Fonts — Cormorant Garamond (başlıqlar), Dancing Script
  (romantik vurğu/mətn), Poppins (UI/body). İkonlar: Font Awesome 6.

## 3. FUNKSIONALLIQ (hamısını düz qur, işlək olsun)
Giriş ekranı:
  · Parol formu. Düzgün parol (ADMIN_PASSWORD ilə proxy üzərindən yoxlanır)
    girişi açır. Yanlışda shake animasiyası + xəta mesajı.
  · Girişdə istifadəçinin IP-i Telegram-a bildiriş kimi gedir.

Ana səhifə (home):
  · Hero: nəhəng ürək + "Fidan & Təhmaz" başlığı.
  · Vaxt sayğacı: 1 Fevral 2023-dən indiyə qədər KEÇƏN gün/saat/dəqiqə/saniyə
    (canlı yenilənir) + aşağıda irəliləyiş barı.
  · 3 statistika kartı: şəkil sayı / məktub sayı / musiqi sayı (GitHub-dan).
  · "Sürprizə keç" düyməsi (sürprizlər bölməsinə).
  · "Ürəyə basılı tut" sevgil gücü: basılı saxladıqca faiz artır (0→100%),
    ürək böyüyür, fon parıldayır.
  · Sevgi mesajı bloku: "Sən mənim hərşeyimsən Fidanım".

Qalereya (gallery):
  · Cloudinary-dən şəkillər dinamik grid-də.
  · Klik → lightbox (böyük şəkil, sol/sağ keçid, sayğac "3 / 10", sil düyməsi).
  · Toplu seçim rejimi (checkbox) + seçilənləri sil.
  · Admin: şəkil yükləmə (drag-drop və ya seç; Cloudinary-yə).

Məktublar (letters):
  · GitHub-dan .txt fayllar siyahı (başlıq + qısa önizləmə + tarix).
  · Klik → modalda tam mətn (Dancing Script şrifti ilə).
  · Admin: müəllif (Fidan/Təhmaz), başlıq, mətn ilə məktub yazıb GitHub-a yüklə.

Musiqilər (music):
  · Cloudinary-dən audio pleylist. Bottom-da kiçik pleyer (başlıq, play/prev/next).
  · Tam ekran pleyer: fırlanan vinil val, Web Audio API tezlik vizualizatoru,
    favorilər (♥), playlistlər yarat/əlavə et, mahni adını dəyiş, sil.
  · Kateqoriyalar: Hamısı / Favorilər / Xüsusi (playlist).
  · Admin: musiqi faylı yüklə (Cloudinary).

Sürprizlər (surprises):
  · 4 kart: "Sürpriz #1/2/3/4". Hərəsi ayrı səhifəyə linklənir:
    surpriz_No1-main/index.html, surpriz_No2-main/index.html,
    surpriz_3.html, surpriz_N04-main/index.html (bu fayllar artıq mövcuddur,
    onları YARATMA, yalnız linklə; varsa üslub uyğunlaşdıra bilərsən).
  · Geri düyməsi ana səhifəyə qayıdır.

Admin panel (modal):
  · 3 tab: Şəkillər / Məktublar / Musiqilər. Yükləmə UI-ları yuxarıdakı kimidir.
  · İstəyə görə IP bloklama inteqrasiyası (proxy vasitəsilə).

Naviqasiya:
  · Aşağıda (bottom-nav) sticky 4 düymə: Ana səhifə / Şəkillər / Məktublar /
    Musiqilər. Aktiv bölmə vurğulanır.

PWA:
  · manifest.json (ad "Dünyamız", theme_color rose, icon-512.png) + sw.js
    (network-first keş, offline dəstək).

## 4. DİZAYN SİSTEMİ — AURORA UI (vacib)
Bu saytın vizual dili məhz budur:
- Palitra: romance rose (#ff4d8d) + violet (#b56cff, #7b5cff). Tünd fon
  default (#0a0710 kimi), açıq fon alternativi ([data-theme="light"]: rose-krem).
- Üslub: glassmorphism (backdrop-filter blur + yarımşəffaf kartlar), parıltı
  (glow) effektləri, gradient mətnlər, yumşaq kölgələr.
- Animasiyalar: aurora mesh-gradient fon (CSS), sürüşən ulduzlar, ürək
  döyünməsi (heartbeat), GSAP ilə bölmə keçidlərində stagger reveal,
  kartlarda 3D tilt (mouse/touch ilə fırlanma).
- Arxa fon: Canvas 2D particle sahəsi (rose/violet hissəciklər, pointer
  repulsiyası, DPR-aware, performans üçün sayı ekran ölçüsünə görə).
- Light/Dark keçid düyməsi header-də (localStorage-də yaddaşa alınır).
- Tipoqrafiya: Cormorant Garamond (başlıqlar), Dancing Script (romantik
  vurğu/məktub mətni), Poppins (UI).
- Mobil-first: 375 / 768 / 1024 / 1440 break-pointləri. Touch hədəfləri ≥44×44px.
  Bottom-nav mərkəzləşdirilmiş "pill" formada.
- Accessibility: prefers-reduced-motion hörmət et (animasiyaları söndür).
  Kontrast 4.5:1.

## 5. QAYDALAR
- Kod təmiz, oxunaqlı, şərhlənmiş olsun. Bir HTML + bir əsas CSS + bir əsas JS
  (və lazımdırsa ayrı enhance.js dizayn təbəqəsi) strukturu tövsiyə olunur.
- Bütün funksionallıq İŞLƏK olmalı (dummy deyil) — Cloudinary upload_preset,
  GitHub API çağrıları, Telegram bildiriş mexanizmi real qurulmalıdır.
- Azərbaycanca mətn və az dil kodu.
- Təhlükəsizlik: API açarları yalnız serverless funksiyada (env). Frontend-ə
  yalnız Cloudinary upload_preset və public cloud_name yaz (secret YOX).
- Sənədlənmiş, genişlənməyə hazır kod.

## 6. İSTƏNİLƏN NƏTİCƏ
Mükəmməl, premium, emosional vizual təcrübə. Sevgililər üçün "wow" effekti:
animasiyalar, rahat keçidlər, parıltı, 3D, aurora fon. Bütün funksionallıq
real işləməlidir. Sayt həm telefon, həm masaüstündə gözəl görünməlidir.