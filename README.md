# Chips Smart-Hub Management System

A Laravel-based backend for managing room reservations, equipment inventory, and check-in status via API.

## Fitur Utama

- CRUD inventory equipment (`equipment`)
- CRUD room scheduling (`rooms`)
- CRUD peminjaman dan booking (`bookings`)
- Authentication token API untuk aplikasi tablet sederhana
- API check-in status pada peminjaman
- MySQL-ready schema dengan migration otomatis

## Setup

1. Salin file environment:

```powershell
Copy-Item .env.example .env
```

2. Ubah database connection di `.env` ke MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_hub
DB_USERNAME=root
DB_PASSWORD=
```

3. Install dependency:

```powershell
composer install
```

4. Generate application key:

```powershell
php artisan key:generate
```

5. Jalankan migration dan seeder:

```powershell
php artisan migrate --seed
```

6. Jalankan server:

```powershell
php artisan serve
```

## Endpoint API

### Public

- `POST /api/login`
- `POST /api/register`

### Authenticated (Bearer token)

- `GET /api/me`
- `POST /api/logout`
- `GET /api/equipment`
- `POST /api/equipment`
- `GET /api/equipment/{id}`
- `PUT/PATCH /api/equipment/{id}`
- `DELETE /api/equipment/{id}`
- `GET /api/rooms`
- `POST /api/rooms`
- `GET /api/rooms/{id}`
- `PUT/PATCH /api/rooms/{id}`
- `DELETE /api/rooms/{id}`
- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/bookings/{id}`
- `PUT/PATCH /api/bookings/{id}`
- `DELETE /api/bookings/{id}`
- `POST /api/bookings/{id}/check-in`

## Catatan

- Gunakan header `Authorization: Bearer {api_token}` untuk semua endpoint terproteksi.
- Data sample admin dan membership sudah tersedia setelah seeding.
- Model Laravel disiapkan untuk mendukung inventory management, scheduling peminjaman, dan check-in real-time.
