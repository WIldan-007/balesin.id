# ============================================
# BALESIN.ID — Backend Integration Setup
# ============================================
# Cara pakai:
# 1. Copy folder ini ke project balesin.id-main/
# 2. npm install (sudah include express, dotenv)
# 3. npm run dev
# ============================================

## 📁 Struktur Backend

```
balesin.id-main/
├── backend/                    # <--- BACKEND BARU
│   ├── server.ts               # Main Express server (ALL endpoints)
│   ├── routes/
│   │   ├── auth.ts             # Login, register, OAuth
│   │   ├── connections.ts      # Instagram, WA, TikTok, Telegram connect
│   │   ├── flows.ts            # CRUD automation flows
│   │   ├── campaigns.ts        # Click tracking + short links
│   │   ├── affiliate.ts        # Affiliate commission + referral
│   │   ├── analytics.ts        # Dashboard stats + revenue
│   │   ├── quiz.ts             # AI quiz generator
│   │   ├── webhooks.ts         # IG/WA/TikTok incoming webhooks
│   │   └── admin.ts            # Admin revenue + user management
│   ├── services/
│   │   ├── instagram.ts        # Meta Graph API v19.0
│   │   ├── whatsapp.ts         # WA Cloud API + Baileys
│   │   ├── tiktok.ts           # TikTok Business API
│   │   ├── telegram.ts         # Telegram Bot API
│   │   ├── ai.ts               # Gemini AI integration
│   │   ├── midtrans.ts         # Payment gateway
│   │   └── database.ts         # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.ts             # JWT verification
│   ├── config/
│   │   └── env.ts              # Environment variables
│   └── seed.ts                 # Seed database with demo data
├── .env                        # API keys
└── server.ts                   # Entry point (loads backend)
```
