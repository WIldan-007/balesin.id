# 📖 TUTORIAL LENGKAP — Cara Mendapatkan API Key untuk Semua Platform
## Panduan untuk User | balesin.id

---

## 📋 DAFTAR ISI

1. [Instagram — Cara Dapat Token](#1-instagram)
2. [WhatsApp — Cara Dapat Token](#2-whatsapp)
3. [TikTok — Cara Dapat Token](#3-tiktok)
4. [Telegram — Cara Dapat Token](#4-telegram)

---

# 1. INSTAGRAM

## 🟢 Paling Mudah — OAuth (1 Klik)
*Cara ini paling recommended, tinggal klik login lewat Facebook.*

**Langkah:**
```
1. Buka halaman Connections di dashboard
2. Klik tombol "Connect Instagram"

   ┌────────────────────────────┐
   │  [+ Connect Platform]      │
   │   📱 Instagram             │
   │   💬 WhatsApp              │
   │   🎵 TikTok                │
   │   ✈️ Telegram              │
   └────────────────────────────┘

3. Akan muncul popup Facebook Login
4. Login dengan Facebook/Instagram kamu
5. Klik "Continue as [nama kamu]"
6. ✅ Selesai! Instagram terhubung otomatis
```

**Waktu:** 30 detik
**Kesulitan:** ⭐ Sangat Mudah

---

## 🟡 Manual — via Graph API Explorer
*Gunakan cara ini jika OAuth tidak muncul.*

### Langkah 1: Buka Graph API Explorer
```
Buka link ini di browser:
https://developers.facebook.com/tools/explorer/
```

### Langkah 2: Pilih App & Token
```
Di halaman Graph API Explorer:

┌──────────────────────────────────────┐
│  Graph API Explorer                  │
│                                      │
│  [Meta Graph API] [v19.0]            │
│                                      │
│  Application:                        │
│  [▼ Pilih: "balesin.id"]            │
│                                      │
│  Token:                              │
│  [▼ Pilih: "Get User or Page Token"] │
│                                      │
│  Permissions:                        │
│  □ instagram_basic                   │
│  □ instagram_manage_comments         │
│  □ instagram_manage_messages         │
│  □ pages_show_list                   │
│                                      │
│  [Generate Token]  →  Klik ini!     │
└──────────────────────────────────────┘
```

### Langkah 3: Login Facebook
```
Akan muncul popup Facebook → Login → Klik "Continue"
```

### Langkah 4: Copy Token
```
Setelah generate, akan muncul token panjang seperti ini:

┌──────────────────────────────────────┐
│  Access Token:                       │
│  EAAc1...xZB4                         │
│                                      │
│  [Copy] ← Klik copy                  │
└──────────────────────────────────────┘
```

### Langkah 5: Paste ke balesin.id
```
Kembali ke dashboard balesin.id:

┌──────────────────────────────────────┐
│  🔌 Connect Instagram                │
│                                      │
│  API Key / Access Token:             │
│  [EAAc1...xZB4________________]      │
│                                      │
│  [Verify & Connect]  ← Klik         │
└──────────────────────────────────────┘

✅ Status akan berubah jadi "CONNECTED"
```

**Waktu:** 2 menit
**Kesulitan:** ⭐⭐ Sedang

---

## 🔴 Lanjutan: Exchange Token Biar Tahan 60 Hari

Token dari Graph API Explorer hanya bertahan **1-2 jam**. Biar tahan **60 hari**:

### Step 1: Dapatkan Short-lived Token
```
Ikuti langkah manual di atas → dapat token pendek
```

### Step 2: Exchange ke Long-lived Token
```
Buka link ini di browser (ganti {token} punya kamu):

https://graph.facebook.com/v19.0/oauth/access_token?
  grant_type=fb_exchange_token&
  client_id=123456789012345&
  client_secret=xxx...xxx&
  fb_exchange_token={TOKEN_KAMU}

→ Akan muncul response JSON seperti ini:

{
  "access_token": "EAAc1...PANJANG",
  "token_type": "bearer",
  "expires_in": 5184000
}

expires_in = 5184000 detik = 60 hari ✅
```

### Step 3: Copy Token Baru ke balesin.id
```
Copy access_token dari response JSON
Paste ke form Connections di dashboard
```

**Note:** 60 hari sekali kamu perlu ulang langkah ini.

---

# 2. WHATSAPP

## 🟢 Metode 1: WA Business API (Official)

### Prasyarat
```
Sebelum mulai, pastikan:
✅ Sudah punya akun Facebook Business
✅ Sudah punya nomor WA khusus bisnis (bukan nomor pribadi)
✅ Nomor sudah diverifikasi Meta
```

### Langkah 1: Buka Meta Business Suite
```
1. Buka: https://business.facebook.com/
2. Login dengan akun Facebook kamu
3. Klik ikon ☰ (menu) di kiri atas
4. Pilih: "WhatsApp Accounts"

   ┌──────────────────────────────┐
   │  ☰ Meta Business Suite       │
   │                              │
   │  › WhatsApp Accounts  ← Klik │
   │  › Settings                  │
   │  › Billing                   │
   └──────────────────────────────┘
```

### Langkah 2: Pilih Akun WhatsApp
```
┌──────────────────────────────────┐
│  WhatsApp Accounts               │
│                                  │
│  [▼ Business Name]               │
│  ┌────────────────────────────┐  │
│  │ 📞 +62 812-3456-7890      │  │
│  │    Phone ID: 1234567890   │  │
│  │    Quality: 🟢 GREEN      │  │
│  └────────────────────────────┘  │
│                                  │
│  → Klik nomor WA kamu           │
└──────────────────────────────────┘
```

### Langkah 3: Dapatkan API Token
```
┌──────────────────────────────────────┐
│  WhatsApp Account                     │
│                                      │
│  API Setup:                          │
│  ┌────────────────────────────────┐  │
│  │ Phone Number ID: 1234567890    │  │
│  │ Business Account ID: 987654321 │  │
│  │                                │  │
│  │ [Generate Token]  ← Klik ini   │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘

→ Setelah klik, akan muncul token:

┌──────────────────────────────────────┐
│  Permanent Access Token              │
│                                      │
│  EAAxZB...bgZD                       │
│                                      │
│  [Copy Token] ← Klik copy            │
└──────────────────────────────────────┘
```

### Langkah 4: Catat Phone Number ID
```
Di halaman yang sama, cari:

Phone Number ID: 1234567890  ← Catat angka ini
```

### Langkah 5: Paste ke balesin.id
```
┌──────────────────────────────────────┐
│  🔌 Connect WhatsApp                 │
│                                      │
│  Handle:                             │
│  [+62 812-3456-7890 ________________]│
│                                      │
│  API Key / Access Token:             │
│  [EAAxZB...bgZD_________________]    │
│                                      │
│  API Version:                        │
│  [v19.0 _______________________]     │
│                                      │
│  [Verify & Connect]  ← Klik         │
└──────────────────────────────────────┘
```

**Waktu:** 5 menit
**Kesulitan:** ⭐⭐⭐ Sedang (butuh verifikasi bisnis)

---

## 🟡 Metode 2: Baileys (Gratis — untuk Testing)

*Cara ini GRATIS, tapi resiko kena banned WhatsApp jika terdeteksi.*

### Step 1: Install & Jalankan
```
Buka terminal / command prompt di laptop/PC kamu.
Jalankan perintah ini (butuh Node.js terinstall):

npx balesin-wa-bot

→ Akan muncul QR CODE di terminal
```

### Step 2: Scan QR
```
┌──────────────────────────┐
│                          │
│    ████████████████      │
│    ██  QR CODE   ██     │
│    ██  SCAN ME!  ██     │
│    ████████████████      │
│                          │
│  Buka WhatsAppmu →       │
│  Settings → Linked       │
│  Devices → Link a Device │
│  Scan QR ini!            │
└──────────────────────────┘
```

### Step 3: Auto Connect
```
Setelah scan QR:
✅ WhatsApp terhubung otomatis
✅ Pesan akan otomatis diteruskan ke balesin.id
```

### Penting!
```
⚠️ Baileys hanya untuk TESTING
⚠️ Risiko WA kena spam warning
⚠️ Untuk production, gunakan WA Business API
```

**Waktu:** 3 menit
**Kesulitan:** ⭐⭐ Sedang

---

# 3. TIKTOK

### Langkah 1: Buka TikTok Developers
```
1. Buka: https://developers.tiktok.com/
2. Login dengan akun TikTok kamu
3. Klik "Create App" di pojok kanan atas

┌──────────────────────────────┐
│  TikTok Developers           │
│                              │
│  [Create App]  ← Klik ini    │
│                              │
│  Atau: My Apps → Create App │
└──────────────────────────────┘
```

### Langkah 2: Buat App Baru
```
┌──────────────────────────────────────┐
│  Create New App                       │
│                                      │
│  App Name: [Balesin Auto          ]  │
│                                      │
│  Platform:                            │
│  ○ iOS                                │
│  ○ Android                            │
│  ● Web App                      ← Pilih│
│                                      │
│  App Description:                     │
│  [Social media automation tool    ]  │
│                                      │
│  Redirect URI:                        │
│  [https://balesin.id/auth/callback]  │
│                                      │
│  [Create]  ← Klik                    │
└──────────────────────────────────────┘
```

### Langkah 3: Dapatkan Client Key
```
Setelah app dibuat, akan muncul halaman detail:

┌──────────────────────────────────────┐
│  Balesin Auto — App Details          │
│                                      │
│  Client Key:    awd1b2c3d4e5f6g7h8i9│
│  Client Secret: a1b2c3d4e5f6g7h8i9j0│
│                                      │
│  [Copy Client Key]  [Copy Secret]    │
└──────────────────────────────────────┘
```

### Langkah 4: Paste ke balesin.id
```
┌──────────────────────────────────────┐
│  🔌 Connect TikTok                   │
│                                      │
│  Handle:                             │
│  [@tiktok_anda ___________________]  │
│                                      │
│  Client Key / API Key:               │
│  [awd1b2c3d4e5f6g7h8i9j0________]   │
│                                      │
│  Client Secret / App Secret:          │
│  [a1b2c3d4e5f6g7h8i9j0________]     │
│                                      │
│  [Verify & Connect]  ← Klik         │
└──────────────────────────────────────┘
```

### Penting!
```
⚠️ TikTok DM API masih RESTRICTED (hanya partner tertentu)
⚠️ Untuk sekarang: komentar otomatis berfungsi, DM belum
⚠️ TikTok butuh review app untuk akses penuh
```

**Waktu:** 5 menit
**Kesulitan:** ⭐⭐ Sedang

---

# 4. TELEGRAM

## 🟢 Paling Mudah — Hanya 3 Langkah!

### Langkah 1: Cari @BotFather
```
Buka aplikasi Telegram
Cari: @BotFather

┌──────────────────────────────┐
│  Telegram                    │
│                              │
│  🔍 Cari: @BotFather         │
│                              │
│  @BotFather                  │
│  The official Telegram bot  │
│  ✓ verified                  │
│                              │
│  → Klik / buka chat         │
└──────────────────────────────┘
```

### Langkah 2: Buat Bot Baru
```
Di chat dengan @BotFather, kirim perintah:

┌────────────────────────────────────────┐
│  You: /newbot                          │
│                                        │
│  BotFather: Okay, what's the name?    │
│                                        │
│  You: Balesin Auto                     │
│                                        │
│  BotFather: Good. Now choose a         │
│  username for your bot. Must end       │
│  with 'bot'. Like: balesin_bot         │
│                                        │
│  You: balesin_auto_bot                 │
│                                        │
│  ──────────────────────────────────    │
│  ✅ Done! Here's your bot token:       │
│                                        │
│  7234567890:AAHkqK...9oL0              │
│                                        │
│  ┌────────────────────┐               │
│  │ [Copy Token]       │               │
│  └────────────────────┘               │
│                                        │
│  ⚠️ JANGAN bagikan token ke siapapun! │
└────────────────────────────────────────┘
```

### Langkah 3: Paste ke balesin.id
```
┌──────────────────────────────────────┐
│  🔌 Connect Telegram                 │
│                                      │
│  Handle:                             │
│  [@balesin_auto_bot ______________]  │
│                                      │
│  Bot Token / API Key:                │
│  [7234567890:AAHkqK...9oL0_______]   │
│                                      │
│  [Verify & Connect]  ← Klik         │
└──────────────────────────────────────┘
```

### ✅ Selesai!
```
Setelah connect, bot kamu akan:
• Auto-reply pesan masuk
• Bisa kirim broadcast
• Terintegrasi dengan flow builder
```

**Waktu:** 1 menit
**Kesulitan:** ⭐ Sangat Mudah

---

# 📊 Rangkuman Tingkat Kesulitan

| Platform | Waktu | Kesulitan | Cara Termudah |
|---|---|---|---|
| **📱 Instagram** | 30 detik | ⭐ | OAuth 1 klik (via Facebook Login) |
| **💬 WhatsApp** | 5 menit | ⭐⭐⭐ | WA Business API (butuh verifikasi bisnis) |
| **🎵 TikTok** | 5 menit | ⭐⭐ | TikTok Developers → Create App |
| **✈️ Telegram** | 1 menit | ⭐ | @BotFather → /newbot → copy token |

---

# ⚠️ Tips Penting

### 1. Simpan Token dengan Aman
```
JANGAN pernah:
❌ Share token ke orang lain
❌ Post token di GitHub public
❌ Kirim token via chat (kecuali aman)

✅ Simpan di password manager (Bitwarden, 1Password)
✅ Gunakan Notepad lokal, jangan cloud
```

### 2. Token Expired — Perpanjang
```
Instagram: 60 hari → perlu refresh token
WhatsApp: 365 hari (permanent token bisa lebih)
TikTok: 30 hari → perlu re-login
Telegram: Tidak pernah expired (sampai kamu revoke)
```

### 3. Kalau Error saat Connect
```
Error "Invalid Token":
→ Token salah atau expired → generate ulang

Error "Permission Denied":
→ Token tidak punya akses → cek permissions di Graph API Explorer

Error "API Rate Limit":
→ Terlalu banyak request → tunggu 15 menit, coba lagi

Error "Connection Failed":
→ Server balesin.id sedang sibuk → coba refresh halaman
```

### 4. Cara Revoke / Putuskan Koneksi
```
Instagram: Buka Facebook → Settings → Apps & Websites → Hapus balesin.id
WhatsApp: Meta Business Suite → WhatsApp → API Setup → Revoke Token
TikTok: TikTok Developers → My Apps → Delete App → Confirm
Telegram: @BotFather → /mybots → Pilih bot → Settings → Revoke Token
```

---

## 🚀 Sudah Siap Semua?

```
✅ Instagram terhubung
✅ WhatsApp terhubung
✅ TikTok terhubung
✅ Telegram terhubung

Sekarang kamu bisa:
• Buat automation flow
• Pantau analytics
• Kelola campaign
• Cek komisi affiliate

Selamat menggunakan balesin.id! 🎉
```

---

*"Semua, Bisa, dibales.in"*
— balesin.id Team
