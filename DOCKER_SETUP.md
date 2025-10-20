# Docker Setup za CRM-ERP Collector System

Ovaj dokument objašnjava kako da pokrenete ceo sistem koristeći Docker kontejnere.

## Prednosti Docker setup-a

- ✅ **Kontrola nad portovima** - Svaki servis ima svoj rezervisan port
- ✅ **Izolacija** - Svaki servis radi u svom kontejneru
- ✅ **Konzistentnost** - Ista okruženja na svim mašinama
- ✅ **Lako upravljanje** - Jednostavno pokretanje/zaustavljanje
- ✅ **Skalabilnost** - Mogućnost horizontalnog skaliranja

## Portovi

| Servis | Port | URL |
|--------|------|-----|
| Web App | 3000 | http://localhost:3000 |
| Workspace Admin | 3001 | http://localhost:3001 |
| Notifications | 3002 | http://localhost:3002 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

## Brzo pokretanje

### Development okruženje

```bash
# Pokretanje development okruženja
make dev

# Ili direktno
docker-compose -f docker-compose.dev.yml up --build
```

### Production okruženje

```bash
# Pokretanje production okruženja
make up

# Ili direktno
docker-compose up --build -d
```

## Dostupne komande

```bash
# Pomoć
make help

# Development
make dev

# Production
make up

# Zaustavljanje
make down

# Logovi
make logs

# Čišćenje
make clean

# Database operacije
make db-migrate
make db-seed

# Logovi po servisima
make web-logs
make workspace-logs
make notifications-logs
```

## Struktura servisa

### Web App (Port 3000)
- Glavna CRM-ERP aplikacija
- Dashboard, korisnici, prodaja, finansije
- Pristup: http://localhost:3000

### Workspace Admin (Port 3001)
- Administracija workspace-ova
- Upravljanje modulima
- Pristup: http://localhost:3001/admin
- Dostupno samo admin korisnicima

### Notifications (Port 3002)
- Servis za notifikacije
- Email, push, real-time notifikacije
- Pristup: http://localhost:3002

### PostgreSQL (Port 5432)
- Glavna baza podataka
- Korisnici, workspace-ovi, moduli

### Redis (Port 6379)
- Cache i session storage
- Real-time komunikacija

## Environment varijable

Svi servisi koriste iste environment varijable:

```env
DATABASE_URL=postgresql://collector_user:collector_password@postgres:5432/collector_db
REDIS_URL=redis://redis:6379
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
JWT_SECRET=your-super-secret-jwt-key-here
```

## Troubleshooting

### Port je zauzet
```bash
# Proverite koji proces koristi port
lsof -ti:3000

# Zaustavite proces
kill -9 $(lsof -ti:3000)
```

### Čišćenje Docker resursa
```bash
# Potpuno čišćenje
make clean

# Ili ručno
docker-compose down -v --remove-orphans
docker system prune -f
```

### Pregled logova
```bash
# Svi servisi
make logs

# Specifični servis
make web-logs
make workspace-logs
make notifications-logs
```

### Restart servisa
```bash
# Restart specifičnog servisa
docker-compose restart web
docker-compose restart workspace
docker-compose restart notifications
```

## Development workflow

1. **Pokretanje**: `make dev`
2. **Izmene koda**: Automatski se reflektuju u kontejnerima
3. **Database migracije**: `make db-migrate`
4. **Seeding**: `make db-seed`
5. **Logovi**: `make logs`

## Production deployment

1. **Build**: `make build`
2. **Pokretanje**: `make up`
3. **Monitoring**: `make logs`

## Mreža

Svi servisi su povezani preko `collector-network` mreže i mogu da komuniciraju jedan sa drugim koristeći imena servisa:

- `postgres:5432` - PostgreSQL baza
- `redis:6379` - Redis cache
- `workspace:3001` - Workspace servis
- `notifications:3002` - Notifications servis

## Backup i restore

```bash
# Backup baze
docker-compose exec postgres pg_dump -U collector_user collector_db > backup.sql

# Restore baze
docker-compose exec -T postgres psql -U collector_user collector_db < backup.sql
```
