# Collector Platform - Tehnička Specifikacija

## Pregled

Ova specifikacija definiše tehničke zahteve, arhitekturu i implementaciju Collector platforme.

## Tech Stack Detaljno

### Frontend Technologies

#### Web Application (Next.js)
```json
{
  "framework": "Next.js 14",
  "runtime": "React 18",
  "language": "TypeScript 5.3+",
  "styling": "TailwindCSS 3.4+",
  "ui": "Shadcn/ui",
  "state": "Zustand + React Query",
  "forms": "React Hook Form + Zod",
  "testing": "Vitest + Testing Library"
}
```

#### Mobile Application (Expo)
```json
{
  "framework": "Expo SDK 50+",
  "runtime": "React Native",
  "language": "TypeScript 5.3+",
  "navigation": "Expo Router",
  "ui": "NativeBase + Shadcn mobile",
  "state": "Zustand + React Query",
  "testing": "Jest + React Native Testing Library"
}
```

#### Desktop Application (Tauri)
```json
{
  "framework": "Tauri 1.5+",
  "frontend": "React 18 + TypeScript",
  "backend": "Rust",
  "ui": "Shadcn/ui + TailwindCSS",
  "state": "Zustand + React Query",
  "system": "Native system integration"
}
```

### Backend Technologies

#### Supabase Stack
```json
{
  "database": "PostgreSQL 15+",
  "auth": "Supabase Auth (JWT)",
  "realtime": "Supabase Realtime (WebSocket)",
  "storage": "Supabase Storage (S3 compatible)",
  "functions": "Supabase Edge Functions (Deno)",
  "api": "Auto-generated REST + GraphQL"
}
```

### Development Tools

#### Monorepo Management
```json
{
  "tool": "Turborepo",
  "packageManager": "Bun 1.0+",
  "build": "Turborepo build system",
  "linting": "ESLint + Prettier",
  "typeChecking": "TypeScript",
  "testing": "Vitest + Jest"
}
```

## Projektna Struktura

### Monorepo Layout
```
collector-platform/
├── apps/
│   ├── web/                          # Next.js web aplikacija
│   │   ├── src/
│   │   │   ├── app/                  # App Router (Next.js 14)
│   │   │   ├── components/           # React komponente
│   │   │   ├── lib/                  # Utility funkcije
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   ├── stores/               # Zustand stores
│   │   │   └── types/                # TypeScript tipovi
│   │   ├── public/                   # Static assets
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   ├── mobile/                       # Expo React Native
│   │   ├── src/
│   │   │   ├── app/                  # Expo Router
│   │   │   ├── components/           # React Native komponente
│   │   │   ├── screens/              # App screens
│   │   │   ├── navigation/           # Navigation setup
│   │   │   ├── hooks/                # Custom hooks
│   │   │   └── stores/               # Zustand stores
│   │   ├── assets/                   # Images, fonts
│   │   ├── app.json                  # Expo config
│   │   └── package.json
│   │
│   ├── desktop/                      # Tauri desktop app
│   │   ├── src/                      # React frontend
│   │   ├── src-tauri/                # Rust backend
│   │   │   ├── src/                  # Rust source
│   │   │   ├── Cargo.toml            # Rust dependencies
│   │   │   └── tauri.conf.json       # Tauri config
│   │   └── package.json
│   │
│   └── admin/                        # Admin dashboard
│       ├── src/
│       ├── package.json
│       └── next.config.js
│
├── packages/
│   ├── ui/                           # Shadcn komponente
│   │   ├── src/
│   │   │   ├── components/           # UI komponente
│   │   │   ├── lib/                  # Utility funkcije
│   │   │   └── styles/               # CSS/Tailwind
│   │   ├── package.json
│   │   └── tailwind.config.js
│   │
│   ├── shared/                       # Deljena logika
│   │   ├── src/
│   │   │   ├── api/                  # API klijenti
│   │   │   ├── hooks/                # Shared hooks
│   │   │   ├── utils/                # Utility funkcije
│   │   │   └── constants/            # Konstante
│   │   └── package.json
│   │
│   ├── types/                        # TypeScript tipovi
│   │   ├── src/
│   │   │   ├── api/                  # API tipovi
│   │   │   ├── database/             # Database tipovi
│   │   │   ├── ui/                   # UI tipovi
│   │   │   └── index.ts              # Export svega
│   │   └── package.json
│   │
│   ├── config/                       # Konfiguracija
│   │   ├── src/
│   │   │   ├── database/             # DB konfiguracija
│   │   │   ├── auth/                 # Auth konfiguracija
│   │   │   ├── api/                  # API konfiguracija
│   │   │   └── env/                  # Environment varijable
│   │   └── package.json
│   │
│   └── database/                     # Supabase shema
│       ├── migrations/               # SQL migracije
│       ├── seed/                     # Seed data
│       ├── types/                    # Generated tipovi
│       └── package.json
│
├── docs/                             # Dokumentacija
│   ├── ARCHITECTURE.md
│   ├── TECHNICAL_SPECIFICATION.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT_GUIDE.md
│
├── tools/                            # Development tools
│   ├── scripts/                      # Build/deploy skripte
│   ├── generators/                   # Code generators
│   └── templates/                    # Code templates
│
├── package.json                      # Root package.json
├── turbo.json                        # Turborepo config
├── bun.lockb                         # Bun lockfile
└── README.md
```

## API Design

### RESTful API Endpoints

#### Authentication Service
```typescript
// Auth endpoints
POST   /api/auth/login              // User login
POST   /api/auth/register           // User registration
POST   /api/auth/logout             // User logout
POST   /api/auth/refresh            // Refresh token
POST   /api/auth/forgot-password    // Password reset
POST   /api/auth/reset-password     // Password reset confirm

// User management
GET    /api/users/profile           // Get user profile
PUT    /api/users/profile           // Update user profile
GET    /api/users                   // List users (admin)
POST   /api/users                   // Create user (admin)
PUT    /api/users/:id               // Update user (admin)
DELETE /api/users/:id               // Delete user (admin)
```

#### CRM Service
```typescript
// Customers
GET    /api/crm/customers           // List customers
POST   /api/crm/customers           // Create customer
GET    /api/crm/customers/:id       // Get customer
PUT    /api/crm/customers/:id       // Update customer
DELETE /api/crm/customers/:id       // Delete customer

// Leads
GET    /api/crm/leads               // List leads
POST   /api/crm/leads               // Create lead
GET    /api/crm/leads/:id           // Get lead
PUT    /api/crm/leads/:id           // Update lead
DELETE /api/crm/leads/:id           // Delete lead

// Sales Pipeline
GET    /api/crm/pipeline            // Get sales pipeline
PUT    /api/crm/pipeline/stages     // Update pipeline stages
GET    /api/crm/opportunities       // List opportunities
POST   /api/crm/opportunities       // Create opportunity
```

#### ERP Service
```typescript
// Invoices
GET    /api/erp/invoices            // List invoices
POST   /api/erp/invoices            // Create invoice
GET    /api/erp/invoices/:id        // Get invoice
PUT    /api/erp/invoices/:id        // Update invoice
DELETE /api/erp/invoices/:id        // Delete invoice
POST   /api/erp/invoices/:id/send   // Send invoice

// Inventory
GET    /api/erp/inventory           // List inventory items
POST   /api/erp/inventory           // Create inventory item
GET    /api/erp/inventory/:id       // Get inventory item
PUT    /api/erp/inventory/:id       // Update inventory item
DELETE /api/erp/inventory/:id       // Delete inventory item

// Financial Reports
GET    /api/erp/reports/income      // Income statement
GET    /api/erp/reports/balance     // Balance sheet
GET    /api/erp/reports/cashflow    // Cash flow statement
```

#### Project Management Service
```typescript
// Projects
GET    /api/pm/projects             // List projects
POST   /api/pm/projects             // Create project
GET    /api/pm/projects/:id         // Get project
PUT    /api/pm/projects/:id         // Update project
DELETE /api/pm/projects/:id         // Delete project

// Tasks
GET    /api/pm/tasks                // List tasks
POST   /api/pm/tasks                // Create task
GET    /api/pm/tasks/:id            // Get task
PUT    /api/pm/tasks/:id            // Update task
DELETE /api/pm/tasks/:id            // Delete task

// Time Tracking
GET    /api/pm/time-entries         // List time entries
POST   /api/pm/time-entries         // Create time entry
PUT    /api/pm/time-entries/:id     // Update time entry
DELETE /api/pm/time-entries/:id     // Delete time entry
```

#### HR Service
```typescript
// Employees
GET    /api/hr/employees            // List employees
POST   /api/hr/employees            // Create employee
GET    /api/hr/employees/:id        // Get employee
PUT    /api/hr/employees/:id        // Update employee
DELETE /api/hr/employees/:id        // Delete employee

// Leave Management
GET    /api/hr/leave-requests       // List leave requests
POST   /api/hr/leave-requests       // Create leave request
PUT    /api/hr/leave-requests/:id   // Update leave request
GET    /api/hr/leave-balance        // Get leave balance

// Payroll
GET    /api/hr/payroll              // List payroll records
POST   /api/hr/payroll/generate     // Generate payroll
GET    /api/hr/payroll/:id          // Get payroll record
```

#### Collaboration Service
```typescript
// Workspaces
GET    /api/collab/workspaces       // List workspaces
POST   /api/collab/workspaces       // Create workspace
GET    /api/collab/workspaces/:id   // Get workspace
PUT    /api/collab/workspaces/:id   // Update workspace
DELETE /api/collab/workspaces/:id   // Delete workspace

// Messages
GET    /api/collab/messages         // List messages
POST   /api/collab/messages         // Send message
PUT    /api/collab/messages/:id     // Update message
DELETE /api/collab/messages/:id     // Delete message

// Files
GET    /api/collab/files            // List files
POST   /api/collab/files            // Upload file
GET    /api/collab/files/:id        // Download file
DELETE /api/collab/files/:id        // Delete file
```

## Database Schema

### Core Tables

#### Users & Authentication
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  phone VARCHAR(20),
  department VARCHAR(100),
  position VARCHAR(100),
  bio TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  subscription_plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization members
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);
```

#### CRM Tables
```sql
-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  source VARCHAR(100),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  value DECIMAL(12,2),
  probability INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES users(id),
  expected_close_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales opportunities
CREATE TABLE sales_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  probability INTEGER DEFAULT 0,
  value DECIMAL(12,2),
  expected_close_date DATE,
  actual_close_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### ERP Tables
```sql
-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  subtotal DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  due_date DATE,
  issued_date DATE,
  paid_date DATE,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice items
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory items
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  description TEXT,
  category VARCHAR(100),
  quantity_in_stock INTEGER DEFAULT 0,
  minimum_stock_level INTEGER DEFAULT 0,
  unit_price DECIMAL(12,2),
  supplier VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Project Management Tables
```sql
-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning',
  priority VARCHAR(20) DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  manager_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project tasks
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  assignee_id UUID REFERENCES users(id),
  due_date DATE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time entries
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES project_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  hours DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### HR Tables
```sql
-- Employees
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) UNIQUE,
  department VARCHAR(100),
  position VARCHAR(100),
  hire_date DATE,
  salary DECIMAL(12,2),
  employment_type VARCHAR(50) DEFAULT 'full-time',
  manager_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leave requests
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll records
CREATE TABLE payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  gross_salary DECIMAL(12,2) NOT NULL,
  deductions DECIMAL(12,2) DEFAULT 0,
  net_salary DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Collaboration Tables
```sql
-- Workspaces
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'general',
  is_private BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace members
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  reply_to UUID REFERENCES messages(id),
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Implementation

### Authentication & Authorization
```typescript
// JWT Token Structure
interface JWTPayload {
  sub: string;        // User ID
  email: string;      // User email
  role: string;       // User role
  org_id: string;     // Organization ID
  iat: number;        // Issued at
  exp: number;        // Expires at
}

// Role-based Access Control
enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  GUEST = 'guest'
}

// Permission System
interface Permission {
  resource: string;   // e.g., 'customers', 'invoices'
  action: string;     // e.g., 'read', 'write', 'delete'
  conditions?: any;   // Additional conditions
}
```

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for customers
CREATE POLICY "Users can view customers in their organization"
ON customers FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Example RLS policy for invoices
CREATE POLICY "Users can view invoices in their organization"
ON invoices FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  )
);
```

## Performance Optimization

### Database Optimization
```sql
-- Indexes for better performance
CREATE INDEX idx_customers_organization_id ON customers(organization_id);
CREATE INDEX idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_tasks_project_id ON project_tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON project_tasks(assignee_id);
CREATE INDEX idx_messages_workspace_id ON messages(workspace_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Composite indexes
CREATE INDEX idx_customers_org_status ON customers(organization_id, status);
CREATE INDEX idx_invoices_org_status ON invoices(organization_id, status);
CREATE INDEX idx_tasks_project_status ON project_tasks(project_id, status);
```

### Caching Strategy
```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Cache keys
const cacheKeys = {
  customers: ['customers'] as const,
  customer: (id: string) => ['customers', id] as const,
  invoices: ['invoices'] as const,
  invoice: (id: string) => ['invoices', id] as const,
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
};
```

## Testing Strategy

### Unit Testing
```typescript
// Example test structure
describe('CustomerService', () => {
  it('should create a new customer', async () => {
    const customerData = {
      name: 'Test Customer',
      email: 'test@example.com',
      organization_id: 'org-123'
    };
    
    const result = await createCustomer(customerData);
    
    expect(result).toBeDefined();
    expect(result.name).toBe(customerData.name);
    expect(result.email).toBe(customerData.email);
  });
});
```

### Integration Testing
```typescript
// API endpoint testing
describe('POST /api/crm/customers', () => {
  it('should create customer with valid data', async () => {
    const response = await request(app)
      .post('/api/crm/customers')
      .send({
        name: 'Test Customer',
        email: 'test@example.com'
      })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Customer');
  });
});
```

### E2E Testing
```typescript
// Playwright E2E tests
test('should create new customer', async ({ page }) => {
  await page.goto('/customers');
  await page.click('[data-testid="add-customer-btn"]');
  await page.fill('[data-testid="customer-name"]', 'Test Customer');
  await page.fill('[data-testid="customer-email"]', 'test@example.com');
  await page.click('[data-testid="save-customer-btn"]');
  
  await expect(page.locator('[data-testid="customer-list"]')).toContainText('Test Customer');
});
```

## Deployment Configuration

### Environment Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Collector
NODE_ENV=development

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Storage
NEXT_PUBLIC_STORAGE_BUCKET=collector-files
MAX_FILE_SIZE=10485760  # 10MB
```

### Docker Configuration
```dockerfile
# Dockerfile for web app
FROM node:18-alpine AS base
WORKDIR /app
COPY package.json bun.lockb ./
RUN npm install -g bun
RUN bun install --frozen-lockfile

FROM base AS dev
COPY . .
CMD ["bun", "run", "dev"]

FROM base AS build
COPY . .
RUN bun run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
RUN npm install -g bun
RUN bun install --production
CMD ["bun", "start"]
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test
      - run: bun run lint
      - run: bun run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Monitoring & Analytics

### Application Monitoring
```typescript
// Error tracking with Sentry
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Performance monitoring
export function trackPerformance(name: string, fn: () => Promise<any>) {
  return Sentry.startTransaction({
    name,
    op: 'function',
  }).then(transaction => {
    return fn().finally(() => {
      transaction.finish();
    });
  });
}
```

### Analytics Integration
```typescript
// Google Analytics 4
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
      </body>
    </html>
  );
}
```

Ova tehnička specifikacija pokriva sve aspekte Collector platforme i služi kao vodič za implementaciju. Svaki deo je detaljno opisan sa konkretnim primerima koda i konfiguracija.
