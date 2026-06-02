# 💗 Bizim Dünyamız

**Fidan & Təhmaz** üçün hazırlanmış PWA dəstəkli şəxsi sevgi veb saytı.

> *"Sevgi hər şeyi bacarır"* — 1 Fevral 2023-cü ildən bəri birlikdə

---

## 🌟 Xüsusiyyətlər

- 📸 **Şəkillər albomu** — Cloudinary-hosted, lightbox görüntüləmə
- ✉️ **Məktublar** — `.txt` formatında saxlanılır, modal oxuma
- 🎵 **Musiqi pleyeri** — Vinil animasiyalı, playlist, full-screen mode
- 🎁 **4 Sürpriz modulu** — Xüsusi interaktiv səhifələr
- ⏱️ **Geri sayğac** — 1 Fevral 2023-dən bəri keçən zaman (gün/saat/dəqiqə/saniyə)
- 💬 **Gündəlik sitat** — Hər gün üçün fərqli sevgi sözləri
- 🛡️ **Admin panel** — Şəkil/musiqi/məktub yükləmə və silmə
- 🤖 **2 Telegram bot inteqrasiyası** — Admin bot + Bildiriş botu
- 📱 **PWA dəstəyi** — Quraşdırıla bilər, offline işləyir

---

## 🛠️ Texniki Stack

| Layer | Texnologiya |
|-------|-------------|
| Frontend | Vanilla HTML / CSS / JavaScript |
| Backend | Node.js (Vercel Functions) |
| Hosting | Vercel |
| Storage - Şəkillər | Cloudinary (`dojz9uzhe`) |
| Storage - Musiqi | Cloudinary (`drlzwhblg`) |
| Content Storage | GitHub repo (JSON + letters/) |
| Botlar | Telegram Bot API (node-telegram-bot-api) |

---

## 📂 Layihə Strukturu

```
/
├── api/
│   ├── bot.js          # Telegram webhook (Vercel)
│   └── proxy.js        # GitHub/Cloudinary gateway
├── letters/            # Məktublar (.txt)
├── music/              # Lokal musiqi faylları (varsa)
├── wishes/             # Arzular (xüsusi)
├── bg-image/           # Arxa fon şəkilləri
├── surpriz_No1-main/   # Sürpriz #1
├── surpriz_No2-main/   # Sürpriz #2
├── surpriz_N04-main/   # Sürpriz #4
├── surpriz_3.html      # Sürpriz #3
├── index.html          # Əsas səhifə
├── style.css           # Bütün stillər
├── script.js           # Bütün frontend JS
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── vercel.json         # Vercel konfiqurasiyası
├── telegram_bot.js     # Lokal polling bot (Railway üçün)
├── package.json        # NPM asılılıqları
├── icon-512.png        # PWA icon
├── blocked_ips.json    # Bloklanmış IP-lər
├── photos_list.json    # Şəkil siyahısı
├── music_list.json     # Musiqi siyahısı
└── README.md           # Bu fayl
```

---

## 🔐 Vercel Environment Variables

| Dəyişən | Təsvir |
|---------|--------|
| `GH_OWNER` | GitHub istifadəçi adı (`XelilovTh`) |
| `GH_REPO` | Repo adı (`Dunyam`) |
| `GH_TOKEN` | GitHub PAT (repo scope) |
| `CL_NAME` | Cloudinary images cloud name (`dojz9uzhe`) |
| `CL_KEY` | Cloudinary images API key |
| `CL_SECRET` | Cloudinary images API secret |
| `CL_MUSIC_NAME` | Cloudinary music cloud name (`drlzwhblg`) |
| `CL_MUSIC_KEY` | Cloudinary music API key |
| `CL_MUSIC_SECRET` | Cloudinary music API secret |
| `TG_TOKEN` | Admin bot token |
| `NOTIF_BOT_TOKEN` | Bildiriş botu token |
| `ADMIN_PASSWORD` | Admin panel şifrəsi |
| `ADMIN_CHAT_ID` | Telegram admin chat ID (default: `6353022269`) |

---

## 🤖 Telegram Bot Flow

### Admin Bot (`TG_TOKEN`)
- Şəkil qəbul edir → Cloudinary-ə yükləyir → `photos_list.json`-a əlavə edir
- Audio/Document qəbul edir → Cloudinary music-ə yükləyir → `music_list.json`-a əlavə edir
- Mətn qəbul edir → `letters/` qovluğuna `.txt` kimi yazır
- `/stats` komandası → statistika göstərir

### Bildiriş Botu (`NOTIF_BOT_TOKEN`)
- Veb saytdan gələn IP bildirişlərini alır
- IP bloklama/blokdan çıxarma düymələri göstərir

---

## 🚀 Yerləşdirmə (Deployment)

1. GitHub repo-ya push et
2. Vercel-də yeni proyekt yarat, repo-nu import et
3. Environment variables-i əlavə et (yuxarıdakı cədvəl)
4. Telegram botlar üçün webhook qur:
   ```
   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<VERCEL_DOMAIN>/api/bot
   ```

---

## 🔄 Branch Strategiyası

- `main` — Production (stabil versiya)
- `feature/bizim-dunyamiz` — Yeni funksionallıqlar burada inkişaf etdirilir

---

## 📝 Versiya Tarixçəsi

- **v2.3.0** — Cache, strukturlaşdırılmış logging, ENV-dən admin ID, gündəlik sitat modulu, təkmilləşdirilmiş PWA
- **v2.2.1** — Stabil versiya
- **v2.2.0** — Cloudinary music dəstəyi, 2 bot ayrılması
- **v2.1** — Telegram bot inteqrasiyası
- **v2.0** — PWA dəstəyi, admin panel
- **v1.0** — İlk versiya

---

Made with 💕 for Fidan.
