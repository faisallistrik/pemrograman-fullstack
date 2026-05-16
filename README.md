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

> Pastikan database `smart_hub` sudah dibuat di MySQL sebelum menjalankan migrate.

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

## Branching Strategy

- Gunakan `master` hanya untuk kode stabil dan hasil akhir tugas.
- Kerjakan setiap fitur di cabang terpisah, misalnya `feature/api-auth`, `feature/equipment-crud`, `feature/booking-checkin`, atau `feature/notification-email`.
- Buat commit kecil yang fokus pada satu perubahan, lalu merge ke `master` melalui pull request atau merge request.
- Hindari bekerja langsung di `master` agar tim bisa menambahkan fitur email/notification tanpa mengganggu tugas utama.

## Database Schema

- `users`
  - `id`, `name`, `email`, `role`, `api_token`, `password`, `remember_token`, `timestamps`
  - menyimpan token API untuk autentikasi tablet.
- `equipment`
  - `id`, `code`, `name`, `category`, `quantity`, `condition`, `status`, `description`, `timestamps`
  - inventory alat dengan status dan kuantitas.
- `rooms`
  - `id`, `name`, `location`, `capacity`, `status`, `description`, `timestamps`
  - data ruang kerja/studio yang dapat dipesan.
- `bookings`
  - `id`, `user_id`, `equipment_id`, `room_id`, `start_time`, `end_time`, `purpose`, `status`, `check_in_at`, `timestamps`
  - booking dapat terkait equipment atau room, lalu dilakukan check-in untuk memperbarui status.

## API Details

- Autentikasi API menggunakan token Bearer dari `api_token`.
- Booking memvalidasi jadwal agar alat atau ruang tidak dibooking dua kali dalam periode yang sama.
- `POST /api/bookings/{id}/check-in` mengubah status booking menjadi `checked_in` dan menyimpan waktu check-in.

## Catatan

- Gunakan header `Authorization: Bearer {api_token}` untuk semua endpoint terproteksi.
- Data sample admin dan membership sudah tersedia setelah seeding.
- Model Laravel disiapkan untuk mendukung inventory management, scheduling peminjaman, dan check-in real-time.
