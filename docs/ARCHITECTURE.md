# Collector Platform - Arhitektura

## Pregled Arhitekture

Collector platforma koristi modernu mikroservisnu arhitekturu sa monorepo pristupom, dizajniranu za skalabilnost, održivost i brz razvoj.

## Arhitekturni Principi

### 1. Mikroservisna Arhitektura
- Svaki modul (CRM, ERP, PM, HR, Collaboration) je nezavisan servis
- Loose coupling između servisa
- Independent deployment i scaling
- Domain-driven design

### 2. Monorepo Pristup
- Centralizovano upravljanje kôdom
- Deljene biblioteke i komponente
- Consistent tooling i konfiguracija
- Efficient dependency management

### 3. Event-Driven Architecture
- Asinhrona komunikacija između servisa
- Event sourcing za audit trail
- Real-time notifikacije
- Decoupled services

## Tehnološka Arhitektura

### Frontend Layer
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                       │
├─────────────────┬─────────────────┬─────────────────────┤
│   Web App       │   Mobile App    │   Desktop App       │
│   (Next.js)     │   (Expo)        │   (Tauri)           │
├─────────────────┴─────────────────┴─────────────────────┤
│              Shared UI Components (Shadcn)              │
├─────────────────────────────────────────────────────────┤
│              State Management (Zustand)                 │
├─────────────────────────────────────────────────────────┤
│              API Client (React Query)                   │
└─────────────────────────────────────────────────────────┘
```

### Backend Layer
```
┌─────────────────────────────────────────────────────────┐
│                    Backend Layer                        │
├─────────────────────────────────────────────────────────┤
│              Supabase Edge Functions                    │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────────┐ │
│  │   CRM   │   ERP   │   PM    │   HR    │Collaboration│ │
│  │ Service │ Service │ Service │ Service │   Service   │ │
│  └─────────┴─────────┴─────────┴─────────┴─────────────┘ │
├─────────────────────────────────────────────────────────┤
│              Supabase Core Services                     │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────────┐ │
│  │   Auth  │Database │Storage  │Realtime │  Analytics  │ │
│  │ Service │(Postgres│ Service │ Service │   Service   │ │
│  │         │   SQL)  │         │         │             │ │
│  └─────────┴─────────┴─────────┴─────────┴─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Mikroservisi Detaljno

### 1. User Management Service
**Odgovornosti:**
- Autentifikacija i autorizacija
- User profile management
- Role-based access control (RBAC)
- Session management

**API Endpoints:**
- `POST /auth/login`
- `POST /auth/register`
- `GET /users/profile`
- `PUT /users/profile`
- `GET /users/roles`

### 2. CRM Service
**Odgovornosti:**
- Customer relationship management
- Lead tracking i conversion
- Sales pipeline management
- Customer support tickets

**API Endpoints:**
- `GET /crm/customers`
- `POST /crm/customers`
- `GET /crm/leads`
- `PUT /crm/leads/{id}/status`
- `GET /crm/pipeline`

### 3. ERP Service
**Odgovornosti:**
- Financial management
- Inventory tracking
- Invoice generation
- Accounting operations

**API Endpoints:**
- `GET /erp/invoices`
- `POST /erp/invoices`
- `GET /erp/inventory`
- `PUT /erp/inventory/{id}`
- `GET /erp/financial-reports`

### 4. Project Management Service
**Odgovornosti:**
- Project lifecycle management
- Task assignment i tracking
- Time tracking
- Resource allocation

**API Endpoints:**
- `GET /pm/projects`
- `POST /pm/projects`
- `GET /pm/tasks`
- `PUT /pm/tasks/{id}/status`
- `POST /pm/time-entries`

### 5. HR Service
**Odgovornosti:**
- Employee management
- Payroll processing
- Leave management
- Performance tracking

**API Endpoints:**
- `GET /hr/employees`
- `POST /hr/employees`
- `GET /hr/payroll`
- `POST /hr/leave-requests`
- `GET /hr/performance`

### 6. Collaboration Service
**Odgovornosti:**
- Real-time messaging
- File sharing
- Video conferencing
- Team workspaces

**API Endpoints:**
- `GET /collab/messages`
- `POST /collab/messages`
- `GET /collab/files`
- `POST /collab/files`
- `GET /collab/workspaces`

### 7. Notification Service
**Odgovornosti:**
- Email notifications
- Push notifications
- SMS notifications
- In-app notifications

**API Endpoints:**
- `POST /notifications/send`
- `GET /notifications/history`
- `PUT /notifications/preferences`

## Baza Podataka

### Supabase PostgreSQL Schema

#### Core Tables
```sql
-- Users i Authentication
users (id, email, name, role, created_at, updated_at)
user_profiles (user_id, avatar, phone, department, position)
user_sessions (id, user_id, token, expires_at)

-- Organizations
organizations (id, name, domain, settings, created_at)
organization_members (org_id, user_id, role, joined_at)

-- CRM Tables
customers (id, name, email, phone, company, status, created_at)
leads (id, customer_id, source, status, value, assigned_to, created_at)
sales_opportunities (id, lead_id, stage, probability, value, expected_close)
support_tickets (id, customer_id, subject, status, priority, assigned_to)

-- ERP Tables
invoices (id, customer_id, number, amount, status, due_date, created_at)
invoice_items (id, invoice_id, description, quantity, price, total)
inventory_items (id, name, sku, quantity, price, category, supplier)
financial_transactions (id, type, amount, description, account, date)

-- Project Management Tables
projects (id, name, description, status, start_date, end_date, manager_id)
project_tasks (id, project_id, title, description, status, assignee_id, due_date)
time_entries (id, task_id, user_id, hours, date, description)
project_milestones (id, project_id, title, due_date, completed_at)

-- HR Tables
employees (id, user_id, employee_id, department, position, hire_date, salary)
leave_requests (id, employee_id, type, start_date, end_date, status, reason)
payroll_records (id, employee_id, period, gross_salary, deductions, net_salary)
performance_reviews (id, employee_id, period, rating, comments, reviewer_id)

-- Collaboration Tables
workspaces (id, name, description, type, created_by, created_at)
workspace_members (workspace_id, user_id, role, joined_at)
messages (id, workspace_id, sender_id, content, type, created_at)
files (id, workspace_id, name, path, size, uploaded_by, created_at)
```

## Event-Driven Communication

### Event Types
```typescript
// User Events
interface UserCreatedEvent {
  type: 'user.created';
  data: { userId: string; email: string; role: string };
}

// CRM Events
interface LeadConvertedEvent {
  type: 'lead.converted';
  data: { leadId: string; customerId: string; value: number };
}

// ERP Events
interface InvoicePaidEvent {
  type: 'invoice.paid';
  data: { invoiceId: string; amount: number; paymentDate: Date };
}

// Project Events
interface TaskCompletedEvent {
  type: 'task.completed';
  data: { taskId: string; projectId: string; completedBy: string };
}

// HR Events
interface LeaveRequestedEvent {
  type: 'leave.requested';
  data: { requestId: string; employeeId: string; startDate: Date; endDate: Date };
}

// Collaboration Events
interface MessageSentEvent {
  type: 'message.sent';
  data: { messageId: string; workspaceId: string; senderId: string };
}
```

## Security Architecture

### Authentication Flow
1. User login kroz Supabase Auth
2. JWT token generation
3. Token validation na svakom request-u
4. Role-based access control

### Authorization Levels
- **Super Admin**: Full system access
- **Admin**: Organization management
- **Manager**: Department/team management
- **Employee**: Basic user access
- **Guest**: Limited read-only access

### Data Security
- Row Level Security (RLS) u Supabase
- Encrypted sensitive data
- Audit logging za sve operacije
- GDPR compliance

## Scalability Considerations

### Horizontal Scaling
- Stateless services
- Load balancing
- Database sharding
- CDN za static assets

### Performance Optimization
- Database indexing
- Query optimization
- Caching strategies
- Lazy loading

### Monitoring i Observability
- Application metrics
- Error tracking
- Performance monitoring
- User analytics

## Deployment Architecture

### Development Environment
- Local development sa Docker
- Supabase local instance
- Hot reload za sve aplikacije

### Staging Environment
- Cloud deployment (Vercel/Netlify)
- Supabase staging project
- Automated testing

### Production Environment
- Multi-region deployment
- Supabase production
- Monitoring i alerting
- Backup strategies
