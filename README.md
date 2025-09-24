# ChatDash - Intelligent Dashboard Platform

A modern Next.js 15 application featuring AI-powered chat interface with customizable dashboards and real-time analytics.

## ✨ Features

- **Animated Landing Page**: Beautiful hero section with Framer Motion animations
- **Interactive Chat Interface**: Real-time messaging with streaming responses and persistent history
- **Visual Analytics**: Google Charts integration with theme-aware styling
- **Dashboard Builder**: Drag-and-drop interface for creating custom dashboards
- **Responsive Design**: Mobile-first approach with safe-area support
- **Dark/Light Theme**: Automatic theme switching with chart adaptation
- **Performance Optimized**: Lazy loading, code splitting, and efficient state management

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Animations**: Framer Motion
- **Charts**: React Google Charts
- **Grid Layout**: React Grid Layout
- **Testing**: Vitest + Playwright

### Project Structure
```
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes (landing)
│   ├── chat/              # Chat interface
│   ├── dashboard/         # Dashboard views
│   └── api/               # API routes
├── components/            # React components
│   ├── Chat/              # Chat-related components
│   ├── Dashboard/         # Dashboard components
│   ├── Landing/           # Landing page components
│   └── UI/                # Shared UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── __tests__/             # Unit tests
└── e2e/                   # End-to-end tests
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file with:

```env
# Optional: WebSocket server URL for real-time features
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Optional: Database connection (if implementing Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/chatdash"

# Optional: Authentication secrets (if implementing NextAuth)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 📱 Usage

### Chat Interface
- Navigate to `/chat` to access the interactive chat
- Use the bottom-right floating input for quick messages
- View conversation metrics in the left sidebar
- Messages persist across sessions

### Dashboard Builder
- Go to `/dashboard/builder` to create custom dashboards
- Drag widgets from the sidebar to the canvas
- Resize and rearrange widgets as needed
- Save and export dashboard configurations
- Switch between Edit and Preview modes

### Theme Management
- Toggle between light/dark modes
- Charts automatically adapt to theme changes
- Responsive design across all screen sizes

## 🧪 Testing

### Unit Tests
```bash
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```

### E2E Tests
```bash
npm run test:e2e          # Headless mode
npm run test:e2e:ui       # Interactive UI mode
```

### Linting & Formatting
```bash
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
npm run format            # Format code
npm run format:check      # Check formatting
```

## 🐳 Docker Deployment

### Local Development
```bash
docker-compose up -d
```

### Production Build
```bash
docker build -t chatdash .
docker run -p 3000:3000 chatdash
```

## 📊 Performance

- **Bundle Size**: Optimized with lazy loading and code splitting
- **Core Web Vitals**: Excellent scores across all metrics  
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO**: Proper meta tags and semantic HTML

## 🔧 Customization

### Adding New Widgets
1. Create component in `components/Dashboard/widgets/`
2. Add to widget factory in `DashboardBuilder.tsx`
3. Update widget types in `hooks/useDashboardBuilder.ts`

### Extending Chat Features
1. Modify message interface in `hooks/useChat.ts`
2. Update API routes in `app/api/chat/`
3. Add new message types to `ChatMessage.tsx`

### Theme Customization
- Modify CSS variables in `app/globals.css`
- Update chart colors in `lib/charts.ts`
- Extend Tailwind config in `tailwind.config.ts`

## 🚧 Production TODOs

### 🔐 Authentication & Security
- [ ] Implement NextAuth with role-based access control
- [ ] Add CSRF protection for API routes  
- [ ] Set up rate limiting for API endpoints
- [ ] Implement input sanitization and validation
- [ ] Configure CORS policies for production
- [ ] Add API key authentication for external integrations

### 📊 Database & Backend
- [ ] Set up Prisma with PostgreSQL schema
- [ ] Implement database migrations and seeding
- [ ] Add Redis for session storage and caching
- [ ] Set up WebSocket server for real-time features
- [ ] Configure backup and recovery procedures
- [ ] Implement database connection pooling

### 🔍 Monitoring & Analytics
- [ ] Integrate error tracking (Sentry)
- [ ] Set up performance monitoring (Vercel Analytics)
- [ ] Add user analytics and event tracking
- [ ] Configure application logging with structured data
- [ ] Set up uptime monitoring and alerting
- [ ] Implement health check endpoints

### 🔒 Secrets & Configuration
- [ ] Move sensitive configuration to environment variables
- [ ] Set up secrets management (AWS Secrets Manager, etc.)
- [ ] Configure different environments (dev, staging, prod)
- [ ] Add configuration validation at startup
- [ ] Implement feature flags system
- [ ] Set up CI/CD pipeline secrets

### 🚀 Deployment & Infrastructure
- [ ] Configure production Docker images
- [ ] Set up container orchestration (Kubernetes/Docker Swarm)
- [ ] Implement load balancing and auto-scaling
- [ ] Configure CDN for static assets
- [ ] Set up SSL certificates and HTTPS
- [ ] Implement blue-green or rolling deployments

### 🧪 Testing & Quality Assurance
- [ ] Increase test coverage to >90%
- [ ] Add integration tests for API routes
- [ ] Set up automated accessibility testing
- [ ] Configure performance testing pipeline
- [ ] Add visual regression testing
- [ ] Implement API contract testing

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourname/chatdash/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourname/chatdash/discussions)
- **Documentation**: [Wiki](https://github.com/yourname/chatdash/wiki)