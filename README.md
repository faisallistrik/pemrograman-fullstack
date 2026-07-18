# Smart-Hub: Asset & Booking Management

Monorepo Chips Smart-Hub Management System — sistem untuk mengelola peminjaman ruangan, inventaris peralatan (asset), dan status check-in melalui API.

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

## 🚀 Menjalankan Sistem

Dependencies sudah terinstall dan database sudah tersambung ke Supabase — tinggal jalankan servernya. Butuh **2 terminal** (backend & frontend berjalan sebagai 2 aplikasi Laravel terpisah).

### Terminal 1 — Backend (API)

```bash
cd "Chips Smart-Hub Management System"
php artisan serve
```

Jalan di `http://localhost:8000`. `.env` backend sudah dikonfigurasi ke Supabase (Postgres via Session Pooler) — tidak perlu setup database lagi.

### Terminal 2 — Frontend (Inertia + React)

```bash
cd Chips-Smart-Hub-Frontend
npm run dev
```

Lalu di **terminal ke-3** (setelah Vite jalan):

```bash
cd Chips-Smart-Hub-Frontend
php artisan serve --port=8001
```

Buka aplikasinya di `http://localhost:8001`.

> ⚠️ Backend (Terminal 1) harus sudah jalan lebih dulu sebelum login — frontend memanggil API lewat Axios ke `http://localhost:8000/api`.

### Login

```
Email: admin@smart-hub.local
Password: password
```

### Cek Tampilan Mobile-Responsive

Buka DevTools (F12) → toggle device toolbar → pilih ukuran tablet (768px) atau custom, lalu navigasi ke halaman Equipment/Rooms/Bookings.

### Setup dari Nol (mesin baru / belum pernah install)

```bash
# Backend
cd "Chips Smart-Hub Management System"
composer install
cp .env.example .env
php artisan key:generate
# isi kredensial Supabase (Session Pooler) di .env, lalu:
php artisan migrate --seed

# Frontend
cd Chips-Smart-Hub-Frontend
composer install
npm install
cp .env.example .env
php artisan key:generate
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
- [x] Setup Supabase connection

### Phase 2: Authentication ✅
- [x] Login page with API integration
- [x] Register page
- [x] Auth middleware
- [x] Token persistence
- [x] Logout functionality

### Phase 3: Master Data ✅
- [x] Equipment list & create
- [x] Equipment delete with confirmation
- [x] Rooms list & create
- [x] Rooms delete with confirmation

### Phase 4: Transactions ✅
- [x] Bookings list with filters
- [x] Create booking form
- [x] Update booking
- [x] Check-in feature

### Phase 5: Testing & Deployment
- [x] API integration tests (login + protected endpoint verified against Supabase-backed DB)
- [ ] Mobile responsiveness tests (belum diverifikasi visual di browser/tablet viewport)
- [x] Deploy to Supabase (migrate --seed berhasil ke Postgres Supabase via Session Pooler)
- [ ] Production deployment

## 🌐 Environment Variables

### Backend (.env)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_HOST=aws-0-<region>.pooler.supabase.com   # Session pooler host, dari Supabase Dashboard > Connect
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.<project-ref>
DB_PASSWORD=<db password>
API_BASE_URL=http://localhost:8000/api
```

> Gunakan **Session pooler** (bukan Direct Connection) jika jaringan lokal tidak punya route IPv6 — host Direct Connection Supabase hanya resolve ke alamat IPv6.

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME="Smart-Hub"
```

> Catatan: hanya backend yang perlu connection string database (via Eloquent). Frontend tidak butuh Supabase anon/service key karena tidak mengakses Supabase langsung — semua data lewat REST API backend.

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
