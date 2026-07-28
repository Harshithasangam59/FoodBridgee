# FoodBridge 🌱 - Food Donation Platform

> **Reduce Food Waste. Feed More Lives.**

FoodBridge is a production-ready full-stack web application that connects restaurants, bakeries, hotels, supermarkets, and food donors with NGOs to reduce food waste and help feed people in need.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)

---

## 🚀 Features

- **Donor Portal**: Post surplus food donations with photo, location, and AI freshness estimates
- **NGO Dashboard**: Browse available donations, reserve food, mark as collected
- **AI Freshness Engine**: Intelligent food freshness estimation (Gemini/OpenAI pluggable)
- **Impact Analytics**: Real-time charts for meals saved, CO₂ prevented, and NGOs connected
- **CSR Reporting**: Professional printable/PDF corporate sustainability reports
- **Notifications**: Real-time alerts for reservations and collections
- **JWT Authentication**: Secure role-based access control (Donor / NGO)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | SQLite (local) |
| Auth | JWT + bcryptjs |
| Charts | Recharts |
| Icons | Lucide React |

---

## 📁 Project Structure

```
FoodBridge/
├── client/                   # React + Vite Frontend
│   ├── src/
│   │   ├── components/       # Navbar, Footer
│   │   ├── context/          # AuthContext, ToastContext
│   │   ├── pages/            # All page components
│   │   ├── services/         # API service layer
│   │   └── styles/           # Global CSS
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                   # Node.js + Express Backend
│   ├── src/
│   │   ├── config/           # SQLite database + seeding
│   │   ├── controllers/      # API handlers
│   │   ├── middleware/       # Auth + error handlers
│   │   └── routes/           # Express routes
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Harshithasangam59/FoodBridge.git
cd FoodBridge
```

### 2. Set up the Backend

```bash
cd server
npm install
cp .env.example .env   # Edit with your settings
npm run dev
```

Server starts at `http://localhost:5000`

### 3. Set up the Frontend

```bash
cd client
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Donor | `donor@foodbridge.org` | `password123` |
| NGO | `ngo@foodbridge.org` | `password123` |

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/donations/available` | List pending donations (public) |
| POST | `/api/donations` | Post new donation (donor) |
| GET | `/api/donations/my-donations` | Donor history |
| POST | `/api/donations/:id/reserve` | Reserve donation (NGO) |
| POST | `/api/donations/:id/collect` | Mark collected |
| GET | `/api/impact/metrics` | Impact statistics |
| POST | `/api/ai/freshness` | AI freshness estimate |
| GET | `/api/notifications` | User notifications |
| GET | `/api/donations/csr-report` | CSR report data |

---

## 🌍 Deployment

### Vercel (Frontend)

```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

### Railway / Render (Backend)

Set environment variables:
```
PORT=5000
JWT_SECRET=your_secret_key
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💚 Impact Formula

```
CO₂ Saved (kg) = Total Meals Saved × 2.5 kg
People Fed      = Total Meals Saved
```

---

*Built with ❤️ for Zero Hunger & Zero Waste*
