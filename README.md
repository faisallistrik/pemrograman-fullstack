# Chips Smart-Hub Management System - Monorepo

Complete system untuk mengelola peminjaman ruangan, inventaris peralatan, dan status check-in melalui API.

## 📁 Struktur Proyek

```
pemrograman-fullstack/
├── Chips Smart-Hub Management System/    # Backend API (Laravel 13)
│   ├── app/                              # Application code
│   ├── routes/api.php                    # API endpoints
│   ├── database/                         # Migrations & seeders
│   ├── composer.json                     # PHP dependencies
│   └── README.md                         # Backend documentation
│
├── Chips-Smart-Hub-Frontend/             # Frontend (Laravel 13 + Inertia JS + React)
│   ├── resources/js/                     # React components
│   ├── resources/views/                  # Blade templates
│   ├── routes/web.php                    # Web routes
│   ├── package.json                      # Node dependencies
│   └── vite.config.js                    # Vite configuration
│
├── .gitignore                            # Root-level ignore file
└── README.md                             # This file
```

## 🚀 Quick Start

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 18+
- MySQL 5.7+ atau PostgreSQL (untuk Supabase)

### Backend Setup

```bash
cd "Chips Smart-Hub Management System"
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Backend akan berjalan di: `http://localhost:8000`

### Frontend Setup

```bash
cd Chips-Smart-Hub-Frontend
composer install
npm install
cp .env.example .env
php artisan key:generate
npm run dev
php artisan serve --port=8001
```

Frontend akan berjalan di: `http://localhost:8001`

## 📚 Teknologi

### Backend
- **Framework**: Laravel 13.8
- **Database**: MySQL / Supabase
- **API**: RESTful dengan token authentication
- **Testing**: PHPUnit

### Frontend
- **Framework**: Laravel 13 + Inertia JS 3.1
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 4.0
- **Build Tool**: Vite
- **API Client**: Axios

## 🔌 API Integration

Frontend mengintegrasikan dengan Backend API di:
- Endpoint: `http://localhost:8000/api`
- Authentication: Bearer Token (disimpan di localStorage)
- CORS: Configured untuk development

### Available Endpoints

**Authentication:**
- `POST /api/login`
- `POST /api/register`
- `GET /api/me`
- `POST /api/logout`

**Resources (Protected):**
- `GET/POST /api/equipment`
- `GET/PUT/DELETE /api/equipment/{id}`
- `GET/POST /api/rooms`
- `GET/PUT/DELETE /api/rooms/{id}`
- `GET/POST /api/bookings`
- `GET/PUT/DELETE /api/bookings/{id}`
- `POST /api/bookings/{id}/check-in`

## 🎨 Mobile Responsive

Aplikasi frontend didesain untuk mobile-first approach:
- **Breakpoints**: Tailwind default (mobile, tablet, desktop)
- **Touch-friendly**: Buttons dan inputs dioptimalkan untuk touch
- **Responsive Images**: Semua gambar responsive
- **Performance**: Optimized untuk slow connections

## 🔄 Git Strategy

### Branching Convention
- `master` - Production-ready code
- `feature/*` - Fitur baru (e.g., `feature/auth-integration`)
- `bugfix/*` - Bug fixes (e.g., `bugfix/login-error`)
- `chore/*` - Maintenance tasks

### Commit Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Refactor code
perf: Performance improvement
test: Add tests
chore: Maintenance
```

## 📝 Feature Checklist

### Phase 1: Foundation ✅
- [x] Setup monorepo structure
- [x] Create Laravel 13 + Inertia JS project
- [x] Configure Tailwind CSS
- [x] Setup Vite build
- [ ] Setup Supabase connection

### Phase 2: Authentication
- [ ] Login page with API integration
- [ ] Register page
- [ ] Auth middleware
- [ ] Token persistence
- [ ] Logout functionality

### Phase 3: Master Data
- [ ] Equipment list & create
- [ ] Equipment delete with confirmation
- [ ] Rooms list & create
- [ ] Rooms delete with confirmation

### Phase 4: Transactions
- [ ] Bookings list with filters
- [ ] Create booking form
- [ ] Update booking
- [ ] Check-in feature

### Phase 5: Testing & Deployment
- [ ] API integration tests
- [ ] Mobile responsiveness tests
- [ ] Deploy to Supabase
- [ ] Production deployment

## 🌐 Environment Variables

### Backend (.env)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=smart_hub
DB_USERNAME=root
DB_PASSWORD=
API_BASE_URL=http://localhost:8000/api
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME="Smart-Hub"
```

### Supabase (When ready)
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

## 🧪 Testing

### Backend
```bash
cd "Chips Smart-Hub Management System"
php artisan test
```

### Frontend
```bash
cd Chips-Smart-Hub-Frontend
npm run test
```

## 📦 Deployment

### Backend
- Deploy ke: Heroku, Digital Ocean, atau VPS
- Database: Supabase atau managed MySQL

### Frontend
- Deploy ke: Vercel, Netlify, atau VPS yang sama dengan backend
- Build command: `npm run build`
- Static files akan di-serve dari `/public/dist`

## 🔐 Security

- API Token authentication
- CSRF protection
- Input validation
- SQL injection prevention
- XSS protection

## 📞 Support

Untuk pertanyaan atau issues, buat issue di repository atau hubungi tim development.

## 📄 License

MIT License - Silakan gunakan project ini untuk tujuan apapun.
