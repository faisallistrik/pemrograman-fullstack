DATABASE_URL=postgresql://postgres.qdekqugmkqqgwjhhvkdz:Zulfiq%40r%261453@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

# Smart-Hub: Asset & Booking Management

## Ringkasan

Sistem manajemen peminjaman ruangan dan inventaris peralatan berbasis web, terdiri dari backend API dan frontend yang dikembangkan sebagai dua aplikasi Laravel terpisah namun terhubung lewat REST API dan autentikasi token. Mendukung alur lengkap mulai dari permintaan booking, persetujuan admin, check-in, hingga pengembalian aset, dengan tampilan mobile-responsive.

## Stack & Teknis

- **Bahasa Pemrograman**: PHP (Laravel 13) untuk backend & frontend, JavaScript/JSX (React 18) untuk UI
- **AI Recommendation**: dikembangkan dengan bantuan Claude Code (Anthropic) sebagai AI pair-programmer sepanjang proses; tidak ada API AI eksternal (mis. OpenAI) yang dipanggil di dalam aplikasi itu sendiri
- **Database (API)**: PostgreSQL terkelola Supabase — diakses backend lewat Eloquent ORM (koneksi database langsung), bukan lewat Supabase Data API/REST. Frontend tidak mengakses database sama sekali; semua data lewat REST API backend

## Flow Aplikasi (Garis Besar)

1. **Autentikasi** — user login/register lewat frontend → dapat Bearer token dari backend API → token dipakai untuk semua request selanjutnya (juga tersedia flow lupa/reset password)
2. **Data Master** (khusus admin) — kelola Equipment & Rooms: list, create, update, delete. Endpoint list tetap bisa dibaca semua user (dibutuhkan saat membuat booking)
3. **Transaksi (Booking)**:
   - User membuat booking equipment/ruangan → status `pending`
   - Admin approve/reject
   - Setelah `approved`, user check-in → status equipment/ruangan otomatis jadi "Dipinjam"/"Sedang Digunakan", dengan validasi jadwal bentrok
   - Setelah selesai dipakai, user menandai selesai → status resource kembali "Tersedia"
4. **Notifikasi & Audit Log** — admin dapat notifikasi booking baru, user dapat notifikasi hasil approval/reject; seluruh aksi (create/update/delete/approve/dst) tercatat di log aktivitas (khusus admin)
5. **Dashboard** — statistik ringkas (equipment/ruangan tersedia, booking aktif/pending) yang di-scope otomatis per role; halaman ini dirender server-side lewat Inertia.js, sementara modul lain (Data Master, Booking) memakai Axios ke REST API

Detail arsitektur & diagram lebih lengkap ada di [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Struktur Proyek (Monorepo)

```
pemrograman-fullstack/
├── Chips Smart-Hub Management System/    # Backend API (Laravel 13)
├── Chips-Smart-Hub-Frontend/             # Frontend (Laravel 13 + Inertia JS + React)
├── ARCHITECTURE.md
└── README.md
```

Backend dan frontend adalah dua project Laravel independen dalam folder terpisah (tidak saling import kode), disatukan dalam satu repository Git agar mudah di-maintain bersamaan.

## Repository

https://github.com/faisallistrik/pemrograman-fullstack (1 repo untuk backend + frontend)

## Testing & Review

Backend: 27 automated feature test (PHPUnit) — mencakup autentikasi, role-based access control, lifecycle booking (approve/reject/check-in/complete), forgot/reset password, pagination & search, dashboard stats, audit log, dan notifikasi. Seluruhnya lulus.

```bash
cd "Chips Smart-Hub Management System"
php artisan test
```

Frontend diverifikasi manual lintas viewport (mobile/tablet/desktop) via browser DevTools, dan integrasi Inertia.js diverifikasi lewat Network tab (halaman Dashboard menerima data langsung dari server, tanpa request XHR terpisah).

## Menjalankan Sistem

Butuh 2 terminal (backend & frontend berjalan sebagai 2 aplikasi Laravel terpisah):

```bash
# Terminal 1 — Backend (API), jalan di :8000
cd "Chips Smart-Hub Management System"
php artisan serve

# Terminal 2 — Frontend, Vite dev server
cd Chips-Smart-Hub-Frontend
npm run dev

# Terminal 3 — Frontend, Laravel serve di :8001 (setelah Vite jalan)
cd Chips-Smart-Hub-Frontend
php artisan serve --port=8001
```

Buka `http://localhost:8001`. Kredensial akun uji coba tersedia di `database/seeders/DatabaseSeeder.php` pada folder backend.
