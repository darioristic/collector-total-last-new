# Notification Microservice

Mikroservis za upravljanje notifikacijama u Collector platformi. Omogućava slanje notifikacija kroz različite kanale (in-app, email, push, SMS) sa real-time funkcionalnostima.

## Funkcionalnosti

- ✅ In-app notifikacije sa real-time ažuriranjima
- ✅ Email notifikacije preko SMTP
- ✅ Push notifikacije preko Firebase
- ✅ SMS notifikacije (planirano)
- ✅ Upravljanje preferencijama korisnika
- ✅ Real-time subscription za live notifikacije
- ✅ Bulk slanje notifikacija
- ✅ Markiranje kao pročitano
- ✅ Expiration notifikacija

## API Endpoints

### Notifications

- `GET /api/notifications?user_id={id}&limit={n}&offset={n}&unread_only={bool}` - Dohvati notifikacije
- `POST /api/notifications` - Kreiraj i pošalji notifikaciju
- `GET /api/notifications/{id}` - Dohvati specifičnu notifikaciju
- `PUT /api/notifications/{id}` - Ažuriraj notifikaciju (mark as read)
- `DELETE /api/notifications/{id}` - Obriši notifikaciju

### Preferences

- `GET /api/notifications/preferences?user_id={id}` - Dohvati preferencije
- `POST /api/notifications/preferences` - Kreiraj/ažuriraj preferencije

## Instalacija

1. Instaliraj dependencies:
```bash
cd apps/notifications
pnpm install
```

2. Kopiraj environment fajl:
```bash
cp env.example .env.local
```

3. Popuni environment varijable u `.env.local`

4. Pokreni development server:
```bash
pnpm dev
```

Servis će biti dostupan na `http://localhost:3003`

## Korišćenje

### U React komponentama

```tsx
import { useNotifications } from '@/hooks/use-notifications'
import { NotificationBell } from '@/components/notification-bell'

function Header({ userId }: { userId: string }) {
  const { notifications, unreadCount, markAsRead } = useNotifications({ userId })
  
  return (
    <div>
      <NotificationBell userId={userId} />
      <span>Unread: {unreadCount}</span>
    </div>
  )
}
```

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

// Slanje notifikacije više korisnika
await notificationService.sendBulkNotification({
  user_ids: ['user-1', 'user-2', 'user-3'],
  title: 'System Maintenance',
  message: 'System will be down for maintenance',
  type: 'warning',
  channels: ['in_app', 'email']
})

// Helper metode za česte tipove notifikacija
await notificationService.sendTaskAssignedNotification(
  'user-123',
  'Fix bug in login',
  'Web App',
  'John Doe'
)
```

## Database Schema

Servis koristi sledeće tabele:

- `notifications` - Glavna tabela za notifikacije
- `notification_preferences` - Preferencije korisnika
- `user_devices` - Device tokeni za push notifikacije

## Real-time funkcionalnosti

Servis koristi Supabase real-time za:
- Live notifikacije kada se kreiraju nove
- Ažuriranje broja nepročitanih notifikacija
- Automatsko ažuriranje UI komponenti

## Konfiguracija

### Email (SMTP)
- Gmail: `smtp.gmail.com:587`
- Outlook: `smtp-mail.outlook.com:587`
- Custom SMTP server

### Push Notifications (Firebase)
1. Kreiraj Firebase projekat
2. Generiši service account key
3. Dodaj environment varijable

### SMS (planirano)
- Twilio integration
- AWS SNS
- Custom SMS provider

## Monitoring

Servis loguje:
- Uspešno slanje notifikacija
- Greške u slanju
- Real-time connection status
- API request/response

## Deployment

Servis se može deployovati na:
- Vercel (preporučeno za Next.js)
- Railway
- Docker container
- AWS/GCP/Azure

Za production, postavi environment varijable i pokreni:
```bash
pnpm build
pnpm start
```
