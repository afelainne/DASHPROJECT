# DesignFlow Pro

> Swiss-minimal SaaS platform for design project management and integrated financial control

## 🚀 Features

### 📋 Project Management
- **Kanban Boards** - Visual project tracking with drag & drop
- **Task Management** - Automated workflow with predefined phases
- **Time Tracking** - Built-in timer for task progress monitoring
- **Progress Visualization** - Real-time progress indicators and phase tracking

### 💰 Financial Control
- **OFX Import** - Automated bank statement processing
- **Category Management** - Dynamic revenue/expense categorization
- **Financial Reports** - DRE and cash flow analysis
- **Real-time Dashboard** - Live financial metrics and KPIs

### 🏗️ Infrastructure
- **Supabase Integration** - PostgreSQL database with RLS
- **Vercel KV Cache** - High-performance temporary storage
- **Sentry Monitoring** - Error tracking and performance monitoring
- **CI/CD Pipeline** - Automated testing and deployment

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Swiss-minimal design system
- **React Query** - Data fetching and caching
- **DND Kit** - Drag and drop functionality

### Backend
- **Next.js API Routes** - Serverless functions
- **Supabase** - Database and authentication
- **Vercel KV** - Redis-compatible cache

### Infrastructure
- **Vercel** - Hosting and deployment
- **Sentry** - Error monitoring
- **GitHub Actions** - CI/CD pipeline
- **Cypress** - E2E testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for KV and deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/designflow-pro.git
   cd designflow-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Vercel KV
   VERCEL_KV_URL=your_kv_url
   VERCEL_KV_TOKEN=your_kv_token
   
   # Sentry
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   ```

4. **Database setup**
   - Create a new Supabase project
   - Run the SQL schema: `sql/schema.sql`
   - Configure Row Level Security policies

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Core Tables
- `projects` - Project information and status
- `tasks` - Project tasks with workflow phases
- `financial_entries` - Revenue and expense tracking
- `categories` - Financial categorization
- `ofx_imports` - Bank statement imports
- `time_entries` - Task time tracking

### Security
- **Row Level Security (RLS)** enabled on all tables
- **User isolation** - Users can only access their own data
- **Automated policies** - Secure by default

## 🧪 Testing

### Unit Tests
```bash
npm test
npm run test:coverage
```

### E2E Tests
```bash
# Interactive mode
npm run cypress:open

# Headless mode
npm run cypress:run

# Full E2E pipeline
npm run e2e
```

### Test Coverage
- **Components** - UI component testing
- **Hooks** - Custom hook testing
- **API Routes** - Endpoint testing
- **E2E Flows** - Critical user journeys

## 📦 Deployment

### Automatic Deployment
- **Main branch** → Production deployment
- **Pull requests** → Preview deployments
- **E2E tests** run on every deployment

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 🔧 Configuration

### Tailwind Configuration
Swiss-minimal design principles:
- Clean typography (Inter font family)
- Neutral color palette
- Generous spacing (8px grid)
- No gradients or 3D effects

### Sentry Configuration
- Error tracking
- Performance monitoring
- Release tracking
- User context

### Cache Strategy
- **Project data** - 1 hour cache
- **Financial data** - 15 minutes cache
- **OFX imports** - 2 hours temporary storage

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── finance/           # Financial pages
│   ├── projects/          # Project pages
│   └── reports/           # Report pages
├── components/            # React components
│   ├── dashboard/         # Dashboard widgets
│   ├── finance/           # Financial components
│   ├── layout/            # Layout components
│   ├── projects/          # Project components
│   └── ui/                # shadcn/ui components
├── cypress/               # E2E tests
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
└── sql/                   # Database schema
```

## 🔒 Security

### Authentication
- Supabase Auth integration
- JWT token management
- Session handling

### Data Protection
- Row Level Security (RLS)
- Input validation
- SQL injection prevention
- XSS protection

### Monitoring
- Error tracking with Sentry
- Performance monitoring
- Security alerts

## 🚀 Performance

### Optimization Strategies
- Server-side rendering (SSR)
- Static generation (SSG)
- Image optimization
- Code splitting
- Bundle optimization

### Caching
- Vercel KV for temporary data
- React Query for client-side caching
- CDN caching for static assets

## 📈 Monitoring

### Error Tracking
- Client-side error capture
- Server-side error logging
- Performance monitoring
- User session replay

### Analytics
- Financial metrics tracking
- Project completion rates
- User engagement metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Maintain 70%+ test coverage
- Follow Swiss design principles
- Use semantic commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling framework
- **Supabase** - Backend infrastructure
- **Vercel** - Hosting platform

---

Made with ❤️ by [Your Team]