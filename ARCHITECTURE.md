# Smart-Hub: Asset & Booking Management - Complete Architecture & Deployment Guide

## 📊 System Overview

**Smart-Hub: Asset & Booking Management** adalah sistem manajemen terintegrasi untuk mengelola peminjaman ruangan, inventaris peralatan (asset), dan status check-in melalui API modern.

### Monorepo Structure
```
pemrograman-fullstack/
├── Chips Smart-Hub Management System/     (Backend API)
├── Chips-Smart-Hub-Frontend/              (Frontend SPA)
├── README.md                              (Project overview)
└── FRONTEND_GUIDE.md                      (Frontend documentation)
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT SIDE (Browser)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  React 18+ Application (Single Page App)                  │ │
│  │  - React Router for navigation                            │ │
│  │  - Context API for state management                       │ │
│  │  - Tailwind CSS for styling                              │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST with Bearer Token
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND - API LAYER (Laravel 13)                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Controllers (AuthController, EquipmentController, etc)   │ │
│  │  - Handle HTTP requests                                   │ │
│  │  - Validate input                                         │ │
│  │  - Return JSON responses                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Models (User, Equipment, Room, Booking)                  │ │
│  │  - Database relationships (Eloquent ORM)                  │ │
│  │  - Business logic                                         │ │
│  │  - Validation rules                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Routes (/api)                                            │ │
│  │  - Public: /login, /register                              │ │
│  │  - Protected: /equipment, /rooms, /bookings, etc          │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE LAYER                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  MySQL or PostgreSQL (Supabase)                           │ │
│  │  - users table                                            │ │
│  │  - equipment table                                        │ │
│  │  - rooms table                                            │ │
│  │  - bookings table                                         │ │
│  │  - migration files for schema                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Data Model

### Users Table
```sql
- id (PK)
- name
- email (UNIQUE)
- password (hashed)
- role (admin, user)
- api_token
- remember_token
- timestamps (created_at, updated_at)
```

### Equipment Table
```sql
- id (PK)
- code
- name
- category
- quantity
- condition (Baik, Rusak, Perbaikan)
- status (Tersedia, Dipinjam)
- description
- timestamps
```

### Rooms Table
```sql
- id (PK)
- name
- location
- capacity
- status (Tersedia, Sedang Digunakan)
- description
- timestamps
```

### Bookings Table
```sql
- id (PK)
- user_id (FK → users)
- equipment_id (FK → equipment)
- room_id (FK → rooms)
- start_time
- end_time
- purpose
- status (pending, checked_in, completed)
- check_in_at
- timestamps
```

---

## 🔄 API Flow Diagram

### Authentication Flow
```
User Input (Email/Password)
         ↓
    POST /api/login
         ↓
    [Controller validates]
         ↓
    [User found & password matches]
         ↓
    [Generate/Return API Token]
         ↓
    [Frontend stores token in localStorage]
         ↓
    [Axios adds token to all future requests]
```

### Resource Request Flow
```
React Component
         ↓
    [User action triggered]
         ↓
    Service (equipmentService, etc)
         ↓
    Axios with Bearer Token
         ↓
    POST/GET /api/resource
         ↓
    [Backend middleware validates token]
         ↓
    [Controller processes request]
         ↓
    [Model queries database]
         ↓
    [JSON response returned]
         ↓
    [Frontend updates component state]
         ↓
    [React re-renders UI]
```

---

## 🔐 Authentication & Authorization

### Token-Based Authentication
1. **Login/Register** → API returns `access_token`
2. **Store Token** → localStorage.setItem('auth_token', token)
3. **Send Token** → Axios adds `Authorization: Bearer {token}`
4. **Validate Token** → Backend middleware checks token
5. **Invalid Token** → 401 response → Redirect to login

### Frontend Route Protection
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Only renders if authenticated
// Otherwise redirects to /login
```

---

## 🛣️ Frontend Routes

| Route | Access | Component | Purpose |
|-------|--------|-----------|---------|
| `/login` | Public | Login.jsx | User authentication |
| `/register` | Public | Register.jsx | New user registration |
| `/dashboard` | Protected | Dashboard.jsx | Main dashboard |
| `/equipment` | Protected | Equipment.jsx | Equipment management |
| `/rooms` | Protected | Rooms.jsx | Room management |
| `/bookings` | Protected | Bookings.jsx | Booking management |

---

## 📡 Backend API Routes

### Public Routes
```
POST /api/login          → AuthController@login
POST /api/register       → AuthController@register
```

### Protected Routes (Bearer Token Required)
```
GET  /api/me             → AuthController@me
POST /api/logout         → AuthController@logout

GET    /api/equipment    → EquipmentController@index
POST   /api/equipment    → EquipmentController@store
GET    /api/equipment/{id} → EquipmentController@show
PUT    /api/equipment/{id} → EquipmentController@update
DELETE /api/equipment/{id} → EquipmentController@destroy

GET    /api/rooms        → RoomController@index
POST   /api/rooms        → RoomController@store
GET    /api/rooms/{id}   → RoomController@show
PUT    /api/rooms/{id}   → RoomController@update
DELETE /api/rooms/{id}   → RoomController@destroy

GET    /api/bookings     → BookingController@index
POST   /api/bookings     → BookingController@store
GET    /api/bookings/{id} → BookingController@show
PUT    /api/bookings/{id} → BookingController@update
DELETE /api/bookings/{id} → BookingController@destroy
POST   /api/bookings/{id}/check-in → BookingController@checkIn
```

---

## 🎨 Frontend Component Structure

### Layout Components
- **AppLayout** - Main authenticated layout (navbar + sidebar)
- **GuestLayout** - Auth pages layout (centered form)

### Page Components
- **Login** - Email/password form
- **Register** - Registration form
- **Dashboard** - Main dashboard with stats
- **Equipment** - Equipment list, create, delete
- **Rooms** - Rooms list, create, delete
- **Bookings** - Bookings list, create, check-in

### Reusable Components
- **ProtectedRoute** - Route guard component
- Modal dialogs (inline in pages)
- Form inputs
- Status badges
- Loading spinners

---

## 🔧 State Management

### React Context API
```javascript
// AuthContext provides:
- user (current user data)
- authenticated (boolean)
- loading (initial auth check)
- login(email, password)
- register(name, email, password)
- logout()
```

### Local Component State
- Form data
- Loading states
- Filter selections
- Modal visibility

---

## 🧠 Service Layer

### Axios Interceptors
```javascript
// Request Interceptor:
- Add Authorization header with token
- Validate CSRF token

// Response Interceptor:
- Handle 401 → redirect to login
- Handle errors → display messages
```

### Service Functions
```javascript
// authService.js
- login()
- register()
- logout()
- getCurrentUser()
- isAuthenticated()
- verifyToken()

// equipmentService.js / roomService.js / bookingService.js
- getAll()
- getById()
- create()
- update()
- delete()
```

---

## 📱 Responsive Design Strategy

### Breakpoints (Tailwind CSS)
| Breakpoint | Screen Size | Usage |
|-----------|-----------|--------|
| Base | < 640px | Mobile phones |
| sm | ≥ 640px | Large phones |
| md | ≥ 768px | Tablets |
| lg | ≥ 1024px | Desktops |
| xl | ≥ 1280px | Large screens |

### Mobile-First Classes
```tailwind
grid-cols-1          # 1 column on mobile
md:grid-cols-2       # 2 columns on tablets
lg:grid-cols-3       # 3 columns on desktop

hidden md:block       # Hidden on mobile, visible on tablet+
```

---

## 🚀 Deployment Checklist

### Backend Deployment
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Run migrations
- [ ] Seed initial data
- [ ] Set up error logging
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Deploy to server (Heroku, Digital Ocean, AWS)

### Frontend Deployment
- [ ] Build production bundle: `npm run build`
- [ ] Configure API endpoint for production
- [ ] Upload to static hosting (Vercel, Netlify, S3)
- [ ] Or deploy same server as backend
- [ ] Set up CDN for assets
- [ ] Configure redirects for SPA
- [ ] Enable HTTPS

### Supabase Migration
- [ ] Create Supabase project
- [ ] Export MySQL schema
- [ ] Import to PostgreSQL
- [ ] Configure authentication
- [ ] Test API connectivity
- [ ] Update connection strings

---

## 🧪 Testing Strategy

### Frontend Testing
```bash
# Unit tests (Jest + React Testing Library)
npm test

# E2E tests (Cypress/Playwright)
npx cypress open

# Check types (if using TypeScript)
npm run type-check
```

### Backend Testing
```bash
# Run tests
php artisan test

# Run with coverage
php artisan test --coverage
```

---

## 🔗 Git Workflow

### Branching Strategy
```
master                 # Production-ready code
├── feature/auth      # Feature branches
├── feature/equipment
├── feature/rooms
└── feature/bookings
```

### Commit Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Refactor code
test: Add tests
chore: Maintenance
```

### PR Process
1. Create feature branch
2. Make changes
3. Test locally
4. Create pull request
5. Code review
6. Merge to master

---

## 📊 Performance Optimization

### Frontend
- [ ] Code splitting with React lazy()
- [ ] Image optimization
- [ ] Minification (Vite handles)
- [ ] Gzip compression
- [ ] Browser caching headers
- [ ] Remove unused dependencies

### Backend
- [ ] Database query optimization
- [ ] Eager loading (Eloquent relationships)
- [ ] Caching (Redis/Memcached)
- [ ] Rate limiting
- [ ] API response compression

---

## 🔒 Security Best Practices

✅ **Implemented:**
- HTTPS only in production
- CSRF protection
- SQL injection prevention (Eloquent)
- XSS prevention (React escaping)
- Secure password hashing (bcrypt)
- Bearer token authentication
- Input validation

📋 **Recommended:**
- [ ] Two-factor authentication
- [ ] Rate limiting
- [ ] IP whitelisting
- [ ] Encryption at rest
- [ ] Regular security audits
- [ ] Dependency scanning

---

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer in front of multiple backends
- Stateless API servers
- Shared database
- Redis for session/cache

### Vertical Scaling
- Database query optimization
- Caching layer
- CDN for static assets
- Database replication/clustering

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS Error | Update backend CORS config |
| Token expired | Refresh token endpoint |
| 404 on refresh | SPA catch-all route in web.php |
| Slow API | Add database indexes |
| Frontend not updating | Check React state updates |
| Database connection | Verify .env credentials |

---

## 📞 Maintenance & Support

### Regular Tasks
- Monitor error logs
- Update dependencies
- Backup database
- Clear old logs
- Monitor performance metrics

### Emergency Support
1. Check error logs
2. Verify database connectivity
3. Check API availability
4. Review recent changes
5. Rollback if necessary

---

## 📚 Additional Resources

### Documentation
- [Laravel Official Docs](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)

### Tools
- Postman - API testing
- DBeaver - Database management
- VS Code - Code editor
- Git - Version control

---

## ✨ Project Summary

| Aspect | Detail |
|--------|--------|
| **Backend** | Laravel 13 API |
| **Frontend** | React 18 + Tailwind CSS |
| **Database** | MySQL / PostgreSQL |
| **Authentication** | Bearer Token API |
| **State Management** | React Context API |
| **Styling** | Tailwind CSS 4.0 |
| **Build Tool** | Vite 8.1+ |
| **Mobile Ready** | Yes - fully responsive |
| **Status** | Ready for deployment |
| **Last Updated** | July 9, 2026 |

---

**Created:** July 9, 2026  
**Status:** ✅ PRODUCTION READY  
**Version:** 1.0.0
