# Collector Platform - UI Design System

## Pregled

Collector platforma koristi Shadcn/ui komponente sa TailwindCSS za konzistentan i moderni dizajn kroz sve aplikacije (web, mobile, desktop).

## Design Principles

### 1. Konsistentnost
- Jedinstveni dizajn sistem kroz sve platforme
- Standardizovane komponente i stilovi
- Konzistentna navigacija i interakcija

### 2. Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

### 3. Responsiveness
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interfaces
- Cross-platform compatibility

### 4. Performance
- Optimized components
- Lazy loading
- Minimal bundle size
- Fast rendering

## Color Palette

### Primary Colors
```css
/* Primary - Blue (reduced orange usage) */
--primary: 221 83% 53%;        /* #3b82f6 */
--primary-foreground: 210 40% 98%; /* #f8fafc */

/* Secondary - Slate */
--secondary: 210 40% 96%;      /* #f1f5f9 */
--secondary-foreground: 222 84% 5%; /* #0f172a */

/* Accent - Orange (only for important elements) */
--accent: 24 9.8% 10%;         /* #1c1917 */
--accent-foreground: 0 0% 98%; /* #fafafa */

/* Destructive - Red */
--destructive: 0 84% 60%;      /* #ef4444 */
--destructive-foreground: 210 40% 98%; /* #f8fafc */
```

### Neutral Colors
```css
/* Background */
--background: 0 0% 100%;       /* #ffffff */
--foreground: 222 84% 5%;      /* #0f172a */

/* Muted */
--muted: 210 40% 96%;          /* #f1f5f9 */
--muted-foreground: 215 16% 47%; /* #64748b */

/* Border */
--border: 214 32% 91%;         /* #e2e8f0 */
--input: 214 32% 91%;          /* #e2e8f0 */

/* Ring */
--ring: 221 83% 53%;           /* #3b82f6 */
```

### Status Colors
```css
/* Success - Green */
--success: 142 76% 36%;        /* #16a34a */
--success-foreground: 355 7% 97%; /* #f0fdf4 */

/* Warning - Yellow */
--warning: 38 92% 50%;         /* #f59e0b */
--warning-foreground: 48 96% 89%; /* #fef3c7 */

/* Info - Blue */
--info: 221 83% 53%;           /* #3b82f6 */
--info-foreground: 210 40% 98%; /* #f8fafc */
```

## Typography

### Font Stack
```css
/* Primary Font - Inter */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace Font - JetBrains Mono */
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale
```css
/* Headings */
--text-4xl: 2.25rem;    /* 36px */
--text-3xl: 1.875rem;   /* 30px */
--text-2xl: 1.5rem;     /* 24px */
--text-xl: 1.25rem;     /* 20px */
--text-lg: 1.125rem;    /* 18px */

/* Body Text */
--text-base: 1rem;      /* 16px */
--text-sm: 0.875rem;    /* 14px */
--text-xs: 0.75rem;     /* 12px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

## Component Library

### Core Components

#### 1. Button Variants
```typescript
// Button component variants
const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  // Orange accent only for critical actions
  critical: "bg-orange-600 text-white hover:bg-orange-700"
};

// Button sizes
const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10"
};
```

#### 2. Form Components
```typescript
// Input component
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

// Select component
const Select = SelectPrimitive.Root;
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
```

#### 3. Data Display Components
```typescript
// Table component
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));

// Card component
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));

// Badge component
const badgeVariants = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground",
  success: "border-transparent bg-success text-success-foreground",
  warning: "border-transparent bg-warning text-warning-foreground"
};
```

#### 4. Navigation Components
```typescript
// Sidebar navigation
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-64 flex-col border-r bg-background",
      className
    )}
    {...props}
  />
));

// Navigation items
const NavigationItem = ({ icon, label, href, isActive }: NavigationItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
      isActive && "bg-accent text-accent-foreground"
    )}
  >
    {icon}
    {label}
  </Link>
);
```

#### 5. Feedback Components
```typescript
// Alert component
const alertVariants = {
  default: "bg-background text-foreground",
  destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  success: "border-success/50 text-success [&>svg]:text-success",
  warning: "border-warning/50 text-warning [&>svg]:text-warning"
};

// Toast component
const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ToastProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        className
      )}
      {...props}
    />
  );
});
```

## Layout System

### Grid System
```css
/* Container */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Responsive breakpoints */
@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container { max-width: 1536px; }
}
```

### Spacing System
```css
/* Spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

## Module-Specific Components

### CRM Components
```typescript
// Customer card
const CustomerCard = ({ customer }: { customer: Customer }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold">{customer.name}</h3>
        <p className="text-sm text-muted-foreground">{customer.email}</p>
      </div>
      <Badge variant={customer.status === 'active' ? 'success' : 'secondary'}>
        {customer.status}
      </Badge>
    </div>
    <div className="mt-4 flex gap-2">
      <Button size="sm" variant="outline">View</Button>
      <Button size="sm" variant="outline">Edit</Button>
    </div>
  </Card>
);

// Sales pipeline
const PipelineStage = ({ stage, opportunities }: PipelineStageProps) => (
  <div className="min-w-64 rounded-lg border bg-muted/50 p-4">
    <h3 className="font-semibold mb-4">{stage.name}</h3>
    <div className="space-y-2">
      {opportunities.map(opportunity => (
        <Card key={opportunity.id} className="p-3">
          <h4 className="font-medium">{opportunity.title}</h4>
          <p className="text-sm text-muted-foreground">
            ${opportunity.value.toLocaleString()}
          </p>
        </Card>
      ))}
    </div>
  </div>
);
```

### ERP Components
```typescript
// Invoice table
const InvoiceTable = ({ invoices }: { invoices: Invoice[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice #</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Due Date</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {invoices.map(invoice => (
        <TableRow key={invoice.id}>
          <TableCell className="font-medium">{invoice.number}</TableCell>
          <TableCell>{invoice.customer.name}</TableCell>
          <TableCell>${invoice.total.toLocaleString()}</TableCell>
          <TableCell>
            <Badge variant={getStatusVariant(invoice.status)}>
              {invoice.status}
            </Badge>
          </TableCell>
          <TableCell>{formatDate(invoice.dueDate)}</TableCell>
          <TableCell>
            <Button size="sm" variant="ghost">View</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

// Inventory item
const InventoryItem = ({ item }: { item: InventoryItem }) => (
  <Card className="p-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
      </div>
      <Badge 
        variant={item.quantity < item.minimumStock ? 'destructive' : 'success'}
      >
        {item.quantity} in stock
      </Badge>
    </div>
    <div className="mt-2 flex justify-between text-sm">
      <span>Price: ${item.price}</span>
      <span>Category: {item.category}</span>
    </div>
  </Card>
);
```

### Project Management Components
```typescript
// Project card
const ProjectCard = ({ project }: { project: Project }) => (
  <Card className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-semibold">{project.name}</h3>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </div>
      <Badge variant={getProjectStatusVariant(project.status)}>
        {project.status}
      </Badge>
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>{project.progress}%</span>
      </div>
      <Progress value={project.progress} className="h-2" />
    </div>
    
    <div className="flex justify-between items-center text-sm text-muted-foreground">
      <span>Due: {formatDate(project.endDate)}</span>
      <span>{project.taskCount} tasks</span>
    </div>
  </Card>
);

// Kanban board
const KanbanBoard = ({ tasks }: { tasks: Task[] }) => {
  const columns = ['todo', 'in-progress', 'review', 'done'];
  
  return (
    <div className="flex gap-4 overflow-x-auto">
      {columns.map(column => (
        <div key={column} className="min-w-64">
          <h3 className="font-semibold mb-4 capitalize">{column}</h3>
          <div className="space-y-2">
            {tasks
              .filter(task => task.status === column)
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### HR Components
```typescript
// Employee card
const EmployeeCard = ({ employee }: { employee: Employee }) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={employee.avatar} />
        <AvatarFallback>{employee.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold">{employee.name}</h3>
        <p className="text-sm text-muted-foreground">{employee.position}</p>
        <p className="text-sm text-muted-foreground">{employee.department}</p>
      </div>
    </div>
    <div className="mt-3 flex gap-2">
      <Button size="sm" variant="outline">View Profile</Button>
      <Button size="sm" variant="outline">Send Message</Button>
    </div>
  </Card>
);

// Leave request
const LeaveRequest = ({ request }: { request: LeaveRequest }) => (
  <Card className="p-4">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="font-semibold">{request.employee.name}</h3>
        <p className="text-sm text-muted-foreground">{request.leaveType}</p>
      </div>
      <Badge variant={getLeaveStatusVariant(request.status)}>
        {request.status}
      </Badge>
    </div>
    <div className="text-sm text-muted-foreground">
      <p>{formatDate(request.startDate)} - {formatDate(request.endDate)}</p>
      <p>{request.daysRequested} days</p>
    </div>
    {request.status === 'pending' && (
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline">Approve</Button>
        <Button size="sm" variant="destructive">Reject</Button>
      </div>
    )}
  </Card>
);
```

### Collaboration Components
```typescript
// Chat message
const ChatMessage = ({ message }: { message: Message }) => (
  <div className="flex gap-3 p-4">
    <Avatar className="h-8 w-8">
      <AvatarImage src={message.sender.avatar} />
      <AvatarFallback>{message.sender.initials}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-sm">{message.sender.name}</span>
        <span className="text-xs text-muted-foreground">
          {formatTime(message.createdAt)}
        </span>
      </div>
      <p className="text-sm">{message.content}</p>
    </div>
  </div>
);

// File upload
const FileUpload = ({ onUpload }: { onUpload: (files: File[]) => void }) => (
  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
    <div className="mt-4">
      <p className="text-sm font-medium">Upload files</p>
      <p className="text-xs text-muted-foreground">
        Drag and drop files here, or click to select
      </p>
    </div>
    <input
      type="file"
      multiple
      onChange={(e) => onUpload(Array.from(e.target.files || []))}
      className="hidden"
      id="file-upload"
    />
    <Button asChild className="mt-4">
      <label htmlFor="file-upload">Choose Files</label>
    </Button>
  </div>
);
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* xs: 0px - 639px (default) */
/* sm: 640px - 767px */
/* md: 768px - 1023px */
/* lg: 1024px - 1279px */
/* xl: 1280px - 1535px */
/* 2xl: 1536px+ */
```

### Mobile Components
```typescript
// Mobile navigation
const MobileNavigation = () => (
  <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
    <div className="flex justify-around py-2">
      <NavigationItem icon={<Home />} label="Home" href="/" />
      <NavigationItem icon={<Users />} label="CRM" href="/crm" />
      <NavigationItem icon={<FileText />} label="ERP" href="/erp" />
      <NavigationItem icon={<Calendar />} label="Projects" href="/projects" />
      <NavigationItem icon={<MessageSquare />} label="Chat" href="/chat" />
    </div>
  </div>
);

// Mobile card layout
const MobileCard = ({ children }: { children: React.ReactNode }) => (
  <Card className="mx-4 mb-4 p-4">
    {children}
  </Card>
);
```

## Dark Mode Support

### Theme Configuration
```typescript
// Theme provider
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <div className={theme}>
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    </div>
  );
};

// Dark mode toggle
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  );
};
```

## Animation & Transitions

### Framer Motion Integration
```typescript
// Page transitions
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

// List animations
const AnimatedList = ({ items }: { items: any[] }) => (
  <AnimatePresence>
    {items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: index * 0.1 }}
      >
        <ItemCard item={item} />
      </motion.div>
    ))}
  </AnimatePresence>
);
```

## Accessibility Features

### ARIA Labels
```typescript
// Accessible button
const AccessibleButton = ({ children, ...props }: ButtonProps) => (
  <Button
    {...props}
    aria-label={props['aria-label'] || children?.toString()}
    role="button"
    tabIndex={0}
  >
    {children}
  </Button>
);

// Accessible form
const AccessibleForm = ({ children }: { children: React.ReactNode }) => (
  <form
    role="form"
    aria-label="Form"
    onSubmit={(e) => e.preventDefault()}
  >
    {children}
  </form>
);
```

### Keyboard Navigation
```typescript
// Keyboard shortcuts
const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Open command palette
            break;
          case 'n':
            e.preventDefault();
            // Create new item
            break;
          case 's':
            e.preventDefault();
            // Save
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

Ovaj design sistem obezbeđuje konzistentan i pristupačan korisnički interfejs kroz sve Collector aplikacije, sa fokusom na smanjenje upotrebe orange boje i korišćenje je samo za kritične elemente.
