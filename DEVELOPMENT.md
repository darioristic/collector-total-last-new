# 🚀 CRM-ERP Development Guide

Ovaj vodič objašnjava kako da pokrenete i upravljate development okruženjem za CRM-ERP Collector Platform.

## 📋 Preduslovi

- **Bun** (>=1.0.0) - package manager
- **Docker** i **Docker Compose** - za bazu podataka i Redis
- **Node.js** (>=18) - za Next.js aplikacije

## 🏃‍♂️ Brzo Pokretanje

### 1. Kloniranje i Instalacija
```bash
git clone <repository-url>
cd CRM-ERP-NEW
bun install
```

### 2. Pokretanje Development Okruženja
```bash
# Pokreni sve servise (preporučeno)
make dev

# Ili direktno
./scripts/dev-start.sh
```

### 3. Pristup Servisima
- **Web App**: http://localhost:3000
- **Notifications**: http://localhost:3002
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🛠️ Dostupne Komande

### Development Komande
```bash
make dev           # Pokreni development okruženje
make dev-docker    # Pokreni samo Docker servise
make dev-status    # Proveri status servisa
make dev-restart   # Restartuj sve servise
make down          # Zaustavi sve servise
make logs          # Prikaži logove
```

### Baza Podataka
```bash
make db-reset      # Resetuj i seeduj bazu
make db-migrate    # Pokreni migracije
make db-migrate-dev # Migracije za development
make db-seed       # Seeduj bazu
```

### Code Quality
```bash
make lint-all      # Lint sve servise
make type-check-all # Type check sve servise
```

## 🏗️ Arhitektura

### Servisi
- **Web** (port 3000) - Glavna Next.js aplikacija
- **Notifications** (port 3002) - Notification microservice
- **PostgreSQL** (port 5432) - Glavna baza podataka
- **Redis** (port 6379) - Cache i session storage

### Struktura Projekta
```
apps/
├── web/              # Glavna Next.js aplikacija
├── notifications/    # Notification servis
├── dashboard/        # Dashboard aplikacija
├── admin/           # Admin panel
└── mobile/          # Mobile aplikacija

packages/
├── shared/          # Deljeni kod
├── types/           # TypeScript tipovi
├── ui/              # UI komponente
└── database/        # Database utilities
```

## 🔧 Development Workflow

### 1. Pokretanje Servisa
```bash
# Automatski (preporučeno)
make dev

# Ručno
./scripts/dev-start.sh
```

### 2. Development
- Kod se automatski reload-uje kada menjate fajlove
- Baza podataka se automatski migrira i seeduje
- Sve servise možete pristupiti preko localhost

### 3. Debugging
```bash
# Proveri status
make dev-status

# Pogledaj logove
make logs

# Restartuj servise
make dev-restart
```

### 4. Zaustavljanje
```bash
make down
```

## 🐳 Docker vs Local Development

### Hybrid Approach (Preporučeno)
- **Docker**: PostgreSQL i Redis
- **Local**: Next.js aplikacije (brže za development)

### Full Docker
```bash
make dev-docker
```

## 🗄️ Baza Podataka

### Prisma Setup
```bash
# Generiši Prisma client
cd apps/web
bunx prisma generate

# Push schema u bazu
bunx prisma db push

# Seed bazu
bun run db:seed
```

### Environment Variables
Kreirajte `.env.local` fajlove u svakom app direktorijumu:
```env
DATABASE_URL="postgresql://collector_user:collector_password@localhost:5432/collector_db"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

## 🚨 Troubleshooting

### Servisi se ne pokreću
```bash
# Proveri da li su portovi zauzeti
lsof -i :3000,3001,3002,5432,6379

# Restartuj sve
make dev-restart
```

### Baza podataka problemi
```bash
# Resetuj bazu
make db-reset

# Ili ručno
cd apps/web
bunx prisma db push --force-reset
bun run db:seed
```

### Docker problemi
```bash
# Očisti Docker
make clean

# Restartuj Docker servise
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d postgres redis
```

## 📝 Development Tips

1. **Koristite `make dev`** umesto ručnog pokretanja servisa
2. **Proverite logove** sa `make logs` ako nešto ne radi
3. **Restartuj servise** sa `make dev-restart` ako imate probleme
4. **Koristite `make db-reset`** za čistu bazu podataka
5. **Proverite status** sa `make dev-status` pre nego što počnete rad

## 🔗 Korisni Linkovi

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Docker Documentation](https://docs.docker.com/)
