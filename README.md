# CRM-ERP Collector System

Kompletan CRM-ERP sistem sa mikroservisima, Docker kontejnerima i modernom arhitekturom.

## 🚀 Funkcionalnosti

### Glavna aplikacija (Web App)
- **Dashboard** - Pregled ključnih metrika i KPI-ja
- **Sales & Finance** - Upravljanje prodajom i finansijama
- **Operations** - Projektni menadžment, file manager, HR
- **Communication** - Chat, mail, AI chat
- **CRM** - Upravljanje klijentima, leads, pipeline

### Workspace Admin
- **Administracija workspace-ova** - Kreiranje i upravljanje workspace-ovima
- **Module Management** - Konfiguracija sistema modula
- **User Management** - Upravljanje korisničkim dozvolama
- **System Settings** - Sistemske konfiguracije
- **Activity Logs** - Praćenje aktivnosti sistema

### Notifications Service
- **Email notifikacije** - Automatski email sistem
- **Push notifikacije** - Real-time push obaveštenja
- **WebSocket** - Real-time komunikacija
- **Redis integration** - Brza cache i session storage

## 🏗️ Arhitektura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │  Workspace      │    │ Notifications   │
│   (Port 3000)   │    │  Admin          │    │ Service         │
│                 │    │  (Port 3001)    │    │ (Port 3002)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Port 5432)   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Redis       │
                    │   (Port 6379)   │
                    └─────────────────┘
```

## 🐳 Docker Setup

Sistem koristi Docker kontejnere za izolaciju i kontrolu portova.

### Portovi
- **Web App**: 3000
- **Workspace Admin**: 3001  
- **Notifications**: 3002
- **PostgreSQL**: 5432
- **Redis**: 6379

### Brzo pokretanje

```bash
# Development okruženje
make dev

# Production okruženje
make up

# Zaustavljanje
make down

# Pregled logova
make logs
```

## 📁 Struktura projekta

```
CRM-ERP-NEW/
├── apps/
│   ├── web/                    # Glavna web aplikacija
│   ├── workspace/              # Workspace admin servis
│   ├── notifications/          # Notifications servis
│   ├── dashboard/              # Dashboard aplikacija
│   ├── admin/                  # Admin aplikacija
│   ├── desktop/                # Desktop aplikacija
│   └── mobile/                 # Mobile aplikacija
├── packages/
│   ├── config/                 # Deljene konfiguracije
│   ├── database/               # Database utilities
│   ├── shared/                 # Deljeni kod
│   ├── types/                  # TypeScript tipovi
│   └── ui/                     # UI komponente
├── docs/                       # Dokumentacija
├── tools/                      # Development alati
├── docker-compose.yml          # Production Docker setup
├── docker-compose.dev.yml      # Development Docker setup
├── Makefile                    # Development komande
└── README.md                   # Ovaj fajl
```

## 🛠️ Tehnologije

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI komponente
- **Lucide React** - Ikone

### Backend
- **Next.js API Routes** - API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Glavna baza
- **Redis** - Cache i session storage

### DevOps
- **Docker** - Kontejnerizacija
- **Docker Compose** - Multi-container setup
- **Makefile** - Development automation

## 🚀 Development

### Preduslovi
- Docker i Docker Compose
- Node.js 18+ (za lokalni development)
- Git

### Pokretanje

```bash
# Kloniranje repozitorijuma
git clone <repository-url>
cd CRM-ERP-NEW

# Pokretanje development okruženja
make dev
```

### Dostupne komande

```bash
make help          # Pomoć
make dev           # Development okruženje
make up            # Production okruženje
make down          # Zaustavljanje
make logs          # Pregled logova
make clean         # Čišćenje
make db-migrate    # Database migracije
make db-seed       # Database seeding
```

## 📊 API Endpoints

### Web App (Port 3000)
- `GET /api/users` - Lista korisnika
- `POST /api/auth/login` - Prijava
- `GET /api/dashboard` - Dashboard podaci

### Workspace Admin (Port 3001)
- `GET /api/workspaces` - Lista workspace-ova
- `POST /api/workspaces` - Kreiranje workspace-a
- `GET /api/modules` - Lista modula
- `POST /api/modules` - Kreiranje modula

### Notifications (Port 3002)
- `POST /api/notifications/send` - Slanje notifikacije
- `GET /api/notifications` - Lista notifikacija
- `WebSocket /ws` - Real-time komunikacija

## 🔐 Autentifikacija

Sistem koristi NextAuth.js za autentifikaciju sa:
- Email/password login
- JWT tokeni
- Session management
- Role-based access control (Admin, User)

## 📈 Monitoring

- **Logovi** - Centralizovani logovi preko Docker
- **Health checks** - Automatski health checkovi
- **Metrics** - KPI dashboard sa real-time metrikama

## 🤝 Doprinos

1. Fork repozitorijum
2. Kreiraj feature branch (`git checkout -b feature/amazing-feature`)
3. Commit izmene (`git commit -m 'Add amazing feature'`)
4. Push na branch (`git push origin feature/amazing-feature`)
5. Otvori Pull Request

## 📄 Licenca

Ovaj projekat je licenciran pod MIT licencom - pogledaj [LICENSE](LICENSE) fajl za detalje.

## 📞 Kontakt

Za pitanja i podršku, otvorite issue na GitHub repozitorijumu.

---

**CRM-ERP Collector System** - Moderna, skalabilna i efikasna CRM-ERP platforma 🚀