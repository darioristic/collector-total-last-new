# Notification Microservice - Setup Guide

## Pregled

Kreirao sam kompletan mikroservis za notifikacije koji omogućava:
- ✅ Real-time notifikacije sa Supabase
- ✅ Email notifikacije preko SMTP
- ✅ Push notifikacije preko Firebase
- ✅ In-app notifikacije sa live ažuriranjima
- ✅ Upravljanje preferencijama korisnika
- ✅ Bulk slanje notifikacija
- ✅ API proxy u web aplikaciji

## Struktura

```
apps/notifications/          # Notification mikroservis
├── app/api/                # API rute
├── lib/                    # Core logika
├── hooks/                  # React hooks
├── components/             # UI komponente
├── scripts/                # Test skriptovi
└── README.md              # Detaljna dokumentacija

apps/web/                   # Web aplikacija (ažurirana)
├── app/api/notifications/  # Proxy API rute
├── hooks/use-notifications.ts # React hook
└── components/layout/header/notifications.tsx # Ažurirana komponenta
```

## Instalacija i Pokretanje

### 1. Instaliraj dependencies

```bash
# U root direktorijumu
pnpm install

# U notification mikroservisu
cd apps/notifications
pnpm install
```

### 2. Konfiguracija Environment Varijabli

Kreiraj `.env.local` fajlove:

**apps/notifications/.env.local:**
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Firebase Configuration (for Push Notifications)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Service Configuration
NOTIFICATION_SERVICE_URL=http://localhost:3003
NODE_ENV=development
```

**apps/web/.env.local:**
```env
# Dodaj ovo u postojeći .env.local
NOTIFICATION_SERVICE_URL=http://localhost:3003
```

### 3. Database Setup

Ažuriraj Prisma schema (već je urađeno):
```bash
cd apps/web
npx prisma db push
```

### 4. Pokretanje Servisa

```bash
# Terminal 1: Notification mikroservis
cd apps/notifications
pnpm dev

# Terminal 2: Web aplikacija
cd apps/web
pnpm dev
```

Notification servis će biti dostupan na `http://localhost:3003`
Web aplikacija će biti dostupna na `http://localhost:3000`

## Testiranje

### 1. Test API endpoints

```bash
# Test slanja notifikacije
curl -X POST http://localhost:3003/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-123",
    "title": "Test Notification",
    "message": "This is a test notification",
    "type": "info",
    "channels": ["in_app", "email"]
  }'

# Test dohvatanja notifikacija
curl "http://localhost:3003/api/notifications?user_id=user-123&limit=10"
```

### 2. Test skript

```bash
cd apps/notifications
pnpm test
```

### 3. UI Test

1. Otvori web aplikaciju na `http://localhost:3000`
2. Klikni na bell ikonu u header-u
3. Trebalo bi da vidiš notifikacije (ako su poslate)

## Korišćenje u Kodu

### Slanje notifikacija iz drugih servisa

```typescript
import { notificationService } from '@/lib/notification-service'

// Slanje notifikacije jednom korisniku
await notificationService.sendNotification({
  user_id: 'user-123',
  title: 'New Task Assigned',
  message: 'You have been assigned a new task',
  type: 'info',
  channels: ['in_app', 'email'],
  metadata: { task_id: 'task-456' }
})

// Helper metode za česte tipove
await notificationService.sendTaskAssignedNotification(
  'user-123',
  'Fix bug in login',
  'Web App',
  'John Doe'
)
```

### Korišćenje u React komponentama

```tsx
import { useNotifications } from '@/hooks/use-notifications'

function MyComponent({ userId }: { userId: string }) {
  const { notifications, unreadCount, markAsRead } = useNotifications({ userId })
  
  return (
    <div>
      <span>Unread: {unreadCount}</span>
      {notifications.map(notification => (
        <div key={notification.id}>
          {notification.title}
        </div>
      ))}
    </div>
  )
}
```

## API Endpoints

### Notification Service (port 3003)

- `GET /api/notifications` - Dohvati notifikacije
- `POST /api/notifications` - Kreiraj i pošalji notifikaciju
- `GET /api/notifications/{id}` - Dohvati specifičnu notifikaciju
- `PUT /api/notifications/{id}` - Ažuriraj notifikaciju
- `DELETE /api/notifications/{id}` - Obriši notifikaciju
- `GET /api/notifications/preferences` - Dohvati preferencije
- `POST /api/notifications/preferences` - Ažuriraj preferencije

### Web App Proxy (port 3000)

- `GET /api/notifications` - Proxy za notification service
- `POST /api/notifications` - Proxy za notification service
- `GET /api/notifications/{id}` - Proxy za notification service
- `PUT /api/notifications/{id}` - Proxy za notification service
- `DELETE /api/notifications/{id}` - Proxy za notification service
- `GET /api/notifications/preferences` - Proxy za notification service
- `POST /api/notifications/preferences` - Proxy za notification service

## Real-time Funkcionalnosti

Servis koristi Supabase real-time za:
- Live notifikacije kada se kreiraju nove
- Ažuriranje broja nepročitanih notifikacija
- Automatsko ažuriranje UI komponenti

## Troubleshooting

### 1. Notification servis se ne pokreće
- Proveri da li su sve environment varijable postavljene
- Proveri da li je port 3003 slobodan

### 2. Notifikacije se ne prikazuju u UI
- Proveri da li je `NOTIFICATION_SERVICE_URL` postavljen u web aplikaciji
- Proveri da li je notification servis pokrenut
- Proveri browser console za greške

### 3. Email notifikacije ne rade
- Proveri SMTP konfiguraciju
- Za Gmail, koristi App Password umesto obične lozinke
- Proveri da li je 2FA omogućen

### 4. Push notifikacije ne rade
- Proveri Firebase konfiguraciju
- Proveri da li je service account key ispravno postavljen
- Proveri da li su device tokeni registrovani

## Production Deployment

Za production deployment:

1. Postavi environment varijable na serveru
2. Deploy notification servis (Vercel, Railway, Docker)
3. Ažuriraj `NOTIFICATION_SERVICE_URL` u web aplikaciji
4. Deploy web aplikaciju

## Dodatne Funkcionalnosti

Mikroservis podržava:
- Expiration notifikacija
- Quiet hours (tihe sate)
- Bulk slanje
- Notification templates
- Analytics i tracking
- Multi-language support (planirano)

## Podrška

Za dodatnu pomoć, pogledaj:
- `apps/notifications/README.md` - Detaljna dokumentacija
- `apps/notifications/scripts/test-notifications.ts` - Test primeri
- API dokumentacija u kodu
