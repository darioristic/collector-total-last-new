# Workspace Admin Service

Mikroservis za upravljanje workspace-ovima i modulima u CRM ERP sistemu.

## Funkcionalnosti

### 🏢 Workspace Management
- Kreiranje i upravljanje workspace-ovima
- Aktiviranje/deaktiviranje workspace-ova
- Pregled statistika (moduli, korisnici, logovi)

### 🔧 Module Management
- Registracija novih modula
- Upravljanje modulima po workspace-u
- Konfiguracija modula
- Omogućavanje/onemogućavanje modula

### 👥 User Management
- Upravljanje korisnicima po workspace-u
- Dodeljivanje uloga (admin, manager, member, viewer)
- Upravljanje dozvolama
- Aktiviranje/deaktiviranje korisnika

### ⚙️ System Settings
- Konfiguracija baze podataka
- Podešavanja notifikacija
- Sigurnosne postavke
- Opšte postavke aplikacije

### 📊 Activity Logs
- Praćenje aktivnosti sistema
- Filtriranje i pretraga logova
- Export logova
- Monitoring korisničkih akcija

## Tehnologije

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI komponente

## Pokretanje

```bash
# Instalacija dependencija
pnpm install

# Setup baze podataka
pnpm db:generate
pnpm db:push

# Pokretanje development servera
pnpm dev
```

Servis će biti dostupan na `http://localhost:3002`

## API Endpoints

### Workspaces
- `GET /api/workspaces` - Lista svih workspace-ova
- `POST /api/workspaces` - Kreiranje novog workspace-a
- `GET /api/workspaces/[id]` - Detalji workspace-a
- `PUT /api/workspaces/[id]` - Ažuriranje workspace-a
- `DELETE /api/workspaces/[id]` - Brisanje workspace-a

### Modules
- `GET /api/modules` - Lista svih modula
- `POST /api/modules` - Registracija novog modula
- `GET /api/workspaces/[id]/modules` - Moduli workspace-a
- `POST /api/workspaces/[id]/modules` - Upravljanje modulom

## Database Schema

### Workspace
- Osnovne informacije o workspace-u
- Status aktivnosti
- Timestamp-ovi

### WorkspaceModule
- Povezivanje workspace-a sa modulima
- Konfiguracija modula
- Status omogućenosti

### WorkspaceSettings
- Podešavanja workspace-a
- Tema, jezik, timezone
- Notifikacije i sigurnost

### WorkspaceUser
- Korisnici workspace-a
- Uloge i dozvole
- Status aktivnosti

### WorkspaceLog
- Logovi aktivnosti
- Detalji akcija
- Audit trail

### SystemConfig
- Sistemske konfiguracije
- Globalne postavke

### ModuleRegistry
- Registar modula
- Verzije i zavisnosti
- Status aktivnosti

## Admin Panel

Admin panel je dostupan na `/admin` rutu i sadrži:

1. **Overview** - Pregled workspace-ova
2. **Modules** - Upravljanje modulima
3. **Users** - Upravljanje korisnicima
4. **Settings** - Sistemske postavke
5. **Activity Logs** - Logovi aktivnosti

## Sigurnost

- Autentifikacija i autorizacija
- Role-based access control
- Audit logging
- Input validation
- SQL injection protection
