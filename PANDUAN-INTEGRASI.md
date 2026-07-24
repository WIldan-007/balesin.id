# ⚡ BALESIN.ID — Panduan Integrasi Lengkap
## Social Media Automation Platform — Setup & Deployment

---

## 📋 DAFTAR ISI
1. [Prasyarat](#1-prasyarat)
2. [Instalasi Project](#2-instalasi-project)
3. [Backend API Setup](#3-backend-api-setup)
4. [Integrasi Instagram](#4-integrasi-instagram)
5. [Integrasi WhatsApp](#5-integrasi-whatsapp)
6. [Integrasi TikTok](#6-integrasi-tiktok)
7. [Integrasi Telegram](#7-integrasi-telegram)
8. [Integrasi AI (Gemini)](#8-integrasi-ai-gemini)
9. [Integrasi Midtrans Payment](#9-integrasi-midtrans-payment)
10. [Integrasi n8n Workflow](#10-integrasi-n8n-workflow)
11. [Deploy ke Production](#11-deploy-ke-production)
12. [Monitoring & Backup](#12-monitoring--backup)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. PRASYARAT

| Requirement | Spesifikasi Minimal |
|---|---|
| **Node.js** | v18 atau lebih baru |
| **npm** | v9+ |
| **VPS/Server** | 2GB RAM, 2 CPU, 20GB SSD |
| **OS** | AlmaLinux 9 / RHEL 9 / Rocky Linux 9 |
| **Domain** | balesin.id (atau domain kamu) |
| **SSL** | Let's Encrypt (gratis) |

### Tools yang Dibutuhkan
```bash
# Cek versi
node --version   # Harus >= 18
npm --version    # Harus >= 9

# Install tools dasar (AlmaLinux/RHEL)
sudo dnf install -y git curl wget

# Clone project
git clone https://github.com/your-username/balesin.id.git
cd balesin.id
```

---

## 2. INSTALASI PROJECT

### 2.1 Install Dependencies
```bash
npm install
```

### 2.2 Konfigurasi Environment
```bash
cp .env.example .env
nano .env   # Isi semua API keys
```

### 2.3 Jalankan Development
```bash
npm run dev
# Backend API: http://localhost:3001
# Frontend:    http://localhost:3000
```

### 2.4 Testing
```bash
# Cek health endpoint
curl http://localhost:3001/api/health

# Response yang diharapkan:
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-07-23T...",
  "connections": 3,
  "flows": 5,
  "campaigns": 3,
  "uptime": 12.5
}
```

---

## 3. BACKEND API SETUP

### 3.1 Struktur Backend
```
balesin.id/
├── backend/
│   └── server.ts          ← Backend server (port 3001)
├── server.ts              ← Frontend server (port 3000, proxy ke 3001)
├── .env                   ← Environment variables
└── package.json           ← Scripts & dependencies
```

### 3.2 API Endpoint Lengkap

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| **AUTH** | | | |
| POST | `/api/auth/register` | Register user baru | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| | | | |
| **CONNECTIONS** | | | |
| POST | `/api/connections/verify` | Verify & connect platform | ✅ |
| GET | `/api/connections` | List semua connection | ✅ |
| DELETE | `/api/connections/:id` | Disconnect platform | ✅ |
| POST | `/api/connections/diagnostics` | Test semua koneksi | ✅ |
| | | | |
| **FLOWS** | | | |
| GET | `/api/flows` | List semua flow | ✅ |
| POST | `/api/flows` | Buat flow baru | ✅ |
| PUT | `/api/flows/:id` | Update flow | ✅ |
| DELETE | `/api/flows/:id` | Hapus flow | ✅ |
| POST | `/api/flows/:id/toggle` | Aktifkan/pause flow | ✅ |
| | | | |
| **CAMPAIGNS** | | | |
| GET | `/api/campaigns` | List campaign | ✅ |
| POST | `/api/campaigns` | Buat campaign + short link | ✅ |
| GET | `/go/:shortCode` | Redirect + click tracking | ❌ |
| | | | |
| **AFFILIATE** | | | |
| GET | `/api/affiliate/dashboard` | Dashboard affiliator | ✅ |
| POST | `/api/affiliate/payout` | Ajukan pencairan | ✅ |
| | | | |
| **ANALYTICS** | | | |
| GET | `/api/analytics/dashboard` | Statistik dashboard | ✅ |
| GET | `/api/analytics/revenue` | Revenue admin | ✅ |
| GET | `/api/logs` | System logs | ✅ |
| | | | |
| **AI** | | | |
| POST | `/api/ai/simulate-reply` | Generate AI reply | ✅ |
| POST | `/api/quiz/generate` | Generate quiz | ✅ |
| | | | |
| **WEBHOOKS** | | | |
| GET | `/api/webhook/instagram` | Meta webhook verify | ❌ |
| POST | `/api/webhook/instagram` | IG real-time events | ❌ |
| POST | `/api/webhook/whatsapp` | WA incoming messages | ❌ |
| | | | |
| **SYSTEM** | | | |
| GET | `/api/health` | Health check | ❌ |

### 3.3 Cara Test API dengan cURL
```bash
# Test health
curl http://localhost:3001/api/health | jq .

# Test register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@balesin.id","password":"test123","fullName":"Test User","referralCode":"BLS001"}'

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@balesin.id","password":"test123"}'
```

---

## 4. INTEGRASI INSTAGRAM

### 4.1 Buat Facebook App
```bash
1. Buka https://developers.facebook.com/
2. Klik "My Apps" → "Create App"
3. Pilih: "Business" → Next
4. Nama App: "Balesin Auto"
5. Email: admin@balesin.id
6. Dapatkan: App ID & App Secret
```

### 4.2 Konfigurasi App
```
1. Settings → Basic:
   - App Domain: balesin.id
   - Privacy Policy URL: https://balesin.id/privacy
   - Category: Business & Pages

2. Add Product: "Instagram Graph API"
   - Setup → Configure

3. Add Product: "Webhooks"
   - Setup → Instagram
   - Callback URL: https://api.balesin.id/api/webhook/instagram
   - Verify Token: balesin-webhook-token-2026
```

### 4.3 Dapatkan Access Token
```
1. Buka: Graph API Explorer (https://developers.facebook.com/tools/explorer/)
2. Pilih App: "Balesin Auto"
3. Pilih Token: "User or Page"
4. Permissions yang dibutuhkan:
   - instagram_basic
   - instagram_manage_comments
   - instagram_manage_messages
   - pages_show_list
5. Generate Token → Copy
6. Exchange ke Long-lived Token (60 hari):
   GET /oauth/access_token?  
     grant_type=fb_exchange_token&
     client_id={APP_ID}&
     client_secret={APP_SECRET}&
     fb_exchange_token={SHORT_TOKEN}
```

### 4.4 Isi .env
```env
FACEBOOK_APP_ID=123456789
FACEBOOK_APP_SECRET=abc123def456
FACEBOOK_WEBHOOK_TOKEN=balesin-webhook-token-2026
```

### 4.5 Test Koneksi
```
Di halaman Connections → Klik "Instagram" → Masukkan Access Token → "Verify & Connect"
Atau via API:
curl -X POST http://localhost:3001/api/connections/verify \
  -H "Content-Type: application/json" \
  -d '{"platform":"Instagram","apiKey":"EAAGm0...X81L","handle":"@balesin_official"}'
```

---

## 5. INTEGRASI WHATSAPP

### 5.1 Metode 1: WA Business API (Official — Recommended)

#### Setup WABA
```bash
1. Buka https://business.facebook.com/
2. Buat WhatsApp Business Account (WABA)
3. Verifikasi bisnis (butuh: NIB, NPWP, SIUP)
4. Daftar nomor WA (nomor khusus bisnis)
5. Dapatkan:
   - Phone Number ID
   - WABA ID
   - Permanent Access Token
```

#### Konfigurasi Webhook
```
1. Buka: Meta Business Suite → WhatsApp → Webhook
2. Callback URL: https://api.balesin.id/api/webhook/whatsapp
3. Verify Token: balesin-wa-webhook-token
4. Subscribe ke: messages, message_deliveries
```

#### Kirim Pesan Test
```bash
curl -X POST https://graph.facebook.com/v19.0/{PHONE_ID}/messages \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "6281234567890",
    "type": "text",
    "text": { "body": "Halo! Balesin AI siap membantu 🚀" }
  }'
```

#### .env
```env
WA_PHONE_NUMBER_ID=1234567890
WA_ACCESS_TOKEN=EAAx...your-token
WA_API_VERSION=v19.0
WA_BUSINESS_ACCOUNT_ID=987654321
```

### 5.2 Metode 2: Baileys (Gratis — untuk Testing)

#### Setup Baileys Gateway
```bash
# Install baileys
npm install @whiskeysockets/baileys

# Buat file: backend/services/baileys-gateway.js
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,   // QR code akan muncul di terminal
  });
  
  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.key.fromMe) {
        // Forward ke backend webhook
        await fetch('http://localhost:3001/api/webhook/whatsapp', {
          method: 'POST',
          body: JSON.stringify({ message: msg }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  });
  
  sock.ev.on('creds.update', saveCreds);
}

startBot();
```

```bash
# Jalankan
node backend/services/baileys-gateway.js
# Scan QR code dengan WhatsApp kamu
```

---

## 6. INTEGRASI TIKTOK

### 6.1 Buat TikTok App

```bash
1. Buka https://developers.tiktok.com/
2. Login → "Create App" → "Web App"
3. Nama: "Balesin Auto"
4. Redirect URI: https://api.balesin.id/api/auth/tiktok/callback
5. Dapatkan: Client Key & Client Secret
```

### 6.2 Permission Scope
```
Scope yang dibutuhkan:
- user.info.basic     (profil)
- video.list          (daftar video)
- video.publish       (upload video)
- comment.list        (baca komentar)
- comment.create      (balas komentar)
```

### 6.3 .env
```env
TIKTOK_CLIENT_KEY=awd123
TIKTOK_CLIENT_SECRET=abc123secret
```

### 6.4 Catatan Penting
```
⚠️ TikTok DM API saat ini masih RESTRICTED — hanya untuk partner tertentu.
Alternatif: polling komentar via Open API setiap 30 detik.

Endpoint yang tersedia:
  GET /video/list/           → ambil video
  GET /video/{id}/comments/  → ambil komentar  
  POST /video/{id}/comments/reply/ → balas komentar
```

---

## 7. INTEGRASI TELEGRAM

### 7.1 Buat Bot Telegram
```bash
1. Buka Telegram → Cari @BotFather
2. Kirim: /newbot
3. Nama: "Balesin Auto"
4. Username: @balesin_auto_bot
5. Dapatkan: Bot Token (format: 123456:ABC-DEF1234ghI)
```

### 7.2 Set Webhook
```bash
# Set webhook bot
curl -X POST https://api.telegram.org/bot{TOKEN}/setWebhook \
  -d "url=https://api.balesin.id/api/webhook/telegram"
```

### 7.3 .env
```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghI
```

---

## 8. INTEGRASI AI (GEMINI)

### 8.1 Dapatkan API Key
```bash
1. Buka https://aistudio.google.com/
2. Login dengan Google Account
3. Klik "Get API Key" → "Create API Key"
4. Copy API Key (format: AIzaSy...)
```

### 8.2 .env
```env
GEMINI_API_KEY=AIzaSy...your-key
```

### 8.3 Test AI
```bash
curl -X POST http://localhost:3001/api/ai/simulate-reply \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Harga produknya berapa?","tone":"Friendly & Professional","platform":"WhatsApp"}'

# Response example:
{
  "success": true,
  "reply": "Halo kak! Terima kasih sudah bertanya. Untuk info harga lengkap, silakan cek DM ya! 😊 #Balesin",
  "isSimulated": false
}
```

### 8.4 Model yang Tersedia
| Model | Kecepatan | Biaya | Cocok Untuk |
|---|---|---|---|
| `gemini-2.5-flash` | ⚡ Sangat Cepat | Gratis (60 req/menit) | Auto reply, chat |
| `gemini-2.5-pro` | Sedang | Berbayar | Analisis kompleks |

---

## 9. INTEGRASI MIDTRANS PAYMENT

### 9.1 Daftar Midtrans
```bash
1. Buka https://dashboard.midtrans.com/
2. Register → "Company"
3. Verifikasi email
4. Pilih: "Production" atau "Sandbox"
```

### 9.2 Dapatkan API Keys
```
Dashboard → Settings → Access Keys:
  - Client Key: untuk frontend (NEXT_PUBLIC_MIDTRANS_CLIENT_KEY)
  - Server Key: untuk backend (RAHASIA!)
```

### 9.3 Set Webhook Notifikasi
```
Midtrans → Settings → Notification:
  - Payment Notification URL: https://api.balesin.id/api/webhook/payment
  - Finish Redirect: https://balesin.id/payment/success
  - Unfinish Redirect: https://balesin.id/payment/pending
  - Error Redirect: https://balesin.id/payment/error
```

### 9.4 .env
```env
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
MIDTRANS_IS_PRODUCTION=false
```

### 9.5 Test Transaksi
```bash
curl -X POST http://localhost:3001/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{"plan":"pro","period":"monthly","userId":"USR-xxx"}'

# Response:
{
  "paymentUrl": "https://app.midtrans.com/payment/...",
  "transactionId": "TRX-xxx",
  "amount": 179000
}
```

---

## 10. INTEGRASI n8n WORKFLOW

### 10.1 Install n8n (AlmaLinux)
```bash
# Install Docker di AlmaLinux
sudo dnf install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker

# Install n8n via Docker
sudo docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_PROTOCOL=https \
  -e N8N_HOST=n8n.balesin.id \
  n8nio/n8n:latest

# Verifikasi
sudo docker ps | grep n8n

# Akses: http://IP_VPS:5678
# Buat akun admin pertama kali
```

### 10.2 Import Workflow
Di n8n UI:
```
1. Workflows → Add Workflow
2. Import from File → Pilih file JSON
3. Update credential untuk setiap node
```

### 10.3 Workflow #1: IG Comment → DM
```json
{
  "name": "IG Auto Reply - Comment to DM",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "ig-comment",
        "responseMode": "lastNode"
      }
    },
    {
      "name": "Filter Existing Replies",
      "type": "n8n-nodes-base.switch",
      "position": [300, 300]
    },
    {
      "name": "AI Generate Reply",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:3001/api/ai/simulate-reply",
        "method": "POST",
        "sendBody": true
      }
    },
    {
      "name": "Send DM via IG",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://graph.facebook.com/v19.0/{{$parameter.igUserId}}/messages",
        "method": "POST",
        "authentication": "genericCredentialType"
      }
    }
  ]
}
```

### 10.4 Workflow #2: Click Tracker
```json
{
  "name": "Click Tracker - Log & Aggregate",
  "nodes": [
    {
      "name": "Cron",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "triggerTimes": { "item": [{ "mode": "everyMinute" }] }
      }
    },
    {
      "name": "Aggregate Clicks",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "SELECT campaign_id, COUNT(*) as daily_clicks FROM click_logs WHERE clicked_at > NOW() - INTERVAL '1 day' GROUP BY campaign_id"
      }
    },
    {
      "name": "Update Campaign Stats",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "UPDATE campaigns SET total_clicks = $1 WHERE id = $2"
      }
    }
  ]
}
```

### 10.5 Webhook URL di Backend
```env
# .env — diisi dengan URL n8n
N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

---

## 11. DEPLOY KE PRODUCTION

### 11.1 Setup VPS (AlmaLinux/RHEL)
```bash
# SSH ke VPS
ssh root@IP_VPS

# Update system
sudo dnf update -y

# Install Node.js 20 via NodeSource
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Install Nginx
sudo dnf install -y nginx

# Install Certbot untuk SSL
sudo dnf install -y epel-release
sudo dnf install -y certbot python3-certbot-nginx

# Enable services
sudo systemctl enable nginx
sudo systemctl start nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 11.2 Copy Project
```bash
# Dari lokal ke VPS
scp -r balesin.id-main root@IP_VPS:/var/www/balesin.id/

# Atau clone dari git
git clone https://github.com/your-username/balesin.id.git /var/www/balesin.id
```

### 11.3 Build & Start
```bash
cd /var/www/balesin.id
npm install
npm run build

# Start dengan PM2
pm2 start dist/backend.cjs --name "balesin-api"
pm2 start dist/server.cjs --name "balesin-web"
pm2 save
pm2 startup
```

### 11.4 Setup Nginx
```nginx
# /etc/nginx/sites-available/balesin.id
server {
    listen 80;
    server_name balesin.id www.balesin.id api.balesin.id;
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name balesin.id www.balesin.id;
    
    ssl_certificate /etc/letsencrypt/live/balesin.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/balesin.id/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl http2;
    server_name api.balesin.id;
    
    ssl_certificate /etc/letsencrypt/live/balesin.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/balesin.id/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # Rate limit
        limit_req zone=api burst=50 nodelay;
    }
    
    # Webhooks — no rate limit
    location /webhook/ {
        proxy_pass http://localhost:3001;
        limit_req off;
    }
}
```

```bash
# Enable site & SSL
ln -s /etc/nginx/sites-available/balesin.id /etc/nginx/sites-enabled/
certbot --nginx -d balesin.id -d www.balesin.id -d api.balesin.id
nginx -t && systemctl reload nginx
```

### 11.5 Firewall (AlmaLinux)
```bash
# AlmaLinux menggunakan firewalld (bukan ufw)
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Buka port
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Verifikasi
sudo firewall-cmd --list-all
```

---

## 12. MONITORING & BACKUP

### 12.1 PM2 Monitoring
```bash
pm2 list                    # Status semua process
pm2 monit                   # Live monitoring (CPU, RAM)
pm2 logs balesin-api        # Lihat log backend
pm2 logs balesin-web        # Lihat log frontend
pm2 restart balesin-api     # Restart backend
```

### 12.2 Auto Backup Script
```bash
#!/bin/bash
# /var/www/balesin.id/scripts/backup.sh

BACKUP_DIR="/root/backups/balesin"
DATE=$(date +%Y-%m-%d)

mkdir -p $BACKUP_DIR

# Backup database (jika pakai PostgreSQL)
pg_dump balesin > $BACKUP_DIR/db-$DATE.sql

# Backup uploads & config
tar -czf $BACKUP_DIR/files-$DATE.tar.gz \
  /var/www/balesin.id/.env \
  /var/www/balesin.id/backend

# Hapus backup > 30 hari
find $BACKUP_DIR -mtime +30 -delete

echo "Backup selesai: $DATE"
```

```bash
# Schedule daily backup
crontab -e
# Tambahkan:
0 3 * * * bash /var/www/balesin.id/scripts/backup.sh
```

### 12.3 Uptime Monitoring
```bash
# Daftar di uptimerobot.com (gratis)
Monitor:
  - https://balesin.id
  - https://api.balesin.id/health
```

---

## 13. TROUBLESHOOTING

### Masalah 1: Instagram Token Expired
```
Gejala: Connection status "RE_AUTH_REQUIRED"
Solusi: 
  1. Buka Graph API Explorer
  2. Generate token baru
  3. Di Connections → Edit → Paste token baru
  4. Klik Verify
```

### Masalah 2: WhatsApp API Error 401
```
Gejala: "Error: Unauthorized" saat test koneksi
Solusi:
  1. Token expired → generate ulang di Meta Business Suite
  2. Pastikan nomor WA sudah terverifikasi
  3. Cek billing WA API (ada limit free tier)
```

### Masalah 3: Gemini AI Not Working
```
Gejala: AI reply selalu simulated
Solusi:
  1. Cek GEMINI_API_KEY di .env
  2. Pastikan internet bisa akses generativelanguage.googleapis.com
  3. Cek rate limit: 60 requests/minute (free tier)
```

### Masalah 4: n8n Webhook Not Triggering
```
Gejala: Flow tidak jalan setelah IG comment
Solusi:
  1. Cek N8N_WEBHOOK_URL di .env
  2. Pastikan n8n server running: docker ps
  3. Test webhook manual:
     curl -X POST http://localhost:5678/webhook/ig-comment \
       -H "Content-Type: application/json" \
       -d '{"text":"test","from":{"username":"test_user"}}'
```

### Masalah 5: Port Already in Use
```bash
# Cek apa yang pakai port
sudo lsof -i :3001
sudo lsof -i :3000

# Kill process
kill -9 $(sudo lsof -t -i:3001)
```

### Masalah 6: CORS Error di Frontend
```
Gejala: "Access-Control-Allow-Origin" error di console browser
Solusi:
  1. Pastikan backend server.ts punya middleware CORS
  2. Di development: proxy Vite handle CORS
  3. Di production: Nginx handle CORS headers
```

---

## ✅ CHECKLIST DEPLOYMENT

| # | Item | Status |
|---|---|---|
| 1 | `npm install` berhasil | □ |
| 2 | `.env` terisi lengkap | □ |
| 3 | `npm run dev:backend` jalan di :3001 | □ |
| 4 | `curl localhost:3001/api/health` return OK | □ |
| 5 | `npm run dev:frontend` jalan di :3000 | □ |
| 6 | Instagram connect berhasil | □ |
| 7 | WhatsApp connect berhasil | □ |
| 8 | TikTok connect berhasil | □ |
| 9 | Gemini AI reply berfungsi | □ |
| 10 | Midtrans payment test Rp 1.000 | □ |
| 11 | n8n workflow terimport | □ |
| 12 | SSL certificate valid | □ |
| 13 | Nginx proxy berfungsi | □ |
| 14 | PM2 auto-start aktif | □ |
| 15 | Backup script berjalan | □ |
| 16 | Uptime monitoring aktif | □ |

---

## 🔗 REFERENSI

| Sumber | Link |
|---|---|
| Meta Graph API Docs | https://developers.facebook.com/docs/graph-api |
| WhatsApp Cloud API | https://developers.facebook.com/docs/whatsapp/cloud-api |
| TikTok API Docs | https://developers.tiktok.com/documentation |
| Telegram Bot API | https://core.telegram.org/bots/api |
| Google AI (Gemini) | https://ai.google.dev/gemini-api/docs |
| Midtrans Docs | https://docs.midtrans.com |
| n8n Docs | https://docs.n8n.io |
| PM2 Docs | https://pm2.keymetrics.io/docs |

---

## SELESAI — BALESIN.ID SIAP DIGUNAKAN 🚀

*"Semua, Bisa, dibales.in"*
— Balesin Team
