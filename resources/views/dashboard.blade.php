<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Smart-Hub</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            font-family: Inter, ui-sans-serif, system-ui, sans-serif;
            background: linear-gradient(180deg, #020617 0%, #0f172a 100%);
            color: #e2e8f0;
        }
        .page {
            max-width: 900px;
            margin: 0 auto;
            padding: 3rem 1.5rem;
        }
        .card {
            background: rgba(15, 23, 42, .92);
            border: 1px solid rgba(148, 163, 184, .12);
            border-radius: 24px;
            padding: 2rem;
            box-shadow: 0 30px 80px rgba(15, 23, 42, .35);
        }
        h1 {
            margin: 0 0 .5rem;
            font-size: clamp(2rem, 3vw, 3rem);
        }
        p {
            margin: .75rem 0 0;
            line-height: 1.75;
            color: #cbd5e1;
        }
        .list {
            margin: 1.5rem 0 0;
            padding-left: 1.2rem;
        }
        .list li {
            margin: .8rem 0;
        }
        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-top: 1.5rem;
            padding: 1rem 1.4rem;
            border-radius: 14px;
            background: #38bdf8;
            color: #020617;
            font-weight: 700;
            text-decoration: none;
        }
        .tag {
            display: inline-block;
            padding: .5rem 1rem;
            margin-top: 1rem;
            border-radius: 999px;
            background: rgba(56, 189, 248, .14);
            color: #bae6fd;
            font-size: .95rem;
        }
        .transaction-form {
            margin-top: 2rem;
            display: grid;
            gap: 1rem;
        }
        .transaction-form label {
            font-size: .95rem;
            color: #cbd5e1;
        }
        .transaction-form input,
        .transaction-form select {
            width: 100%;
            padding: .95rem 1rem;
            border-radius: 14px;
            border: 1px solid rgba(148, 163, 184, .12);
            background: rgba(15, 23, 42, .9);
            color: #f8fafc;
            font-size: 1rem;
        }
        .message {
            margin-top: 1.5rem;
            padding: 1rem;
            border-radius: 16px;
            border: 1px solid rgba(148, 163, 184, .18);
        }
        .message.success {
            background: rgba(52, 211, 153, .12);
            color: #a7f3d0;
        }
        .message.error {
            background: rgba(248, 113, 113, .12);
            color: #fecaca;
        }
        .booking-list {
            margin-top: 1.5rem;
            display: grid;
            gap: 1rem;
        }
        .booking-item {
            padding: 1rem;
            border-radius: 18px;
            background: rgba(15, 23, 42, .85);
            border: 1px solid rgba(148, 163, 184, .12);
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="card">
            <h1>Dashboard Smart-Hub</h1>
            <p>Selamat datang, <strong>{{ auth()->user()->name }}</strong>. Anda masuk sebagai <span class="tag">{{ auth()->user()->role }}</span>.</p>

            <p>Gunakan API di bawah ini untuk mengelola proyek Smart-Hub. Jika ingin mengakses API, gunakan token atau endpoint web login.</p>
            <ul class="list">
                <li><strong>Public API:</strong> POST <code>/api/login</code>, POST <code>/api/register</code></li>
                <li><strong>Equipment:</strong> GET <code>/api/equipment</code>, POST <code>/api/equipment</code></li>
                <li><strong>Rooms:</strong> GET <code>/api/rooms</code>, POST <code>/api/rooms</code></li>
                <li><strong>Bookings:</strong> GET <code>/api/bookings</code>, POST <code>/api/bookings</code>, POST <code>/api/bookings/{id}/check-in</code></li>
            </ul>

            @if (session('success'))
                <div class="message success">{{ session('success') }}</div>
            @endif

            @if ($errors->any())
                <div class="message error">
                    <strong>Terjadi kesalahan:</strong>
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('transaction.store') }}" method="POST" class="transaction-form">
                @csrf

                <label for="equipment_id">Pilih Equipment</label>
                <select id="equipment_id" name="equipment_id">
                    <option value="">-- Pilih equipment --</option>
                    @foreach($equipments as $equipment)
                        <option value="{{ $equipment->id }}" {{ old('equipment_id') == $equipment->id ? 'selected' : '' }}>{{ $equipment->name }} ({{ $equipment->quantity }} stok)</option>
                    @endforeach
                </select>

                <label for="room_id">Pilih Ruangan</label>
                <select id="room_id" name="room_id">
                    <option value="">-- Pilih ruangan --</option>
                    @foreach($rooms as $room)
                        <option value="{{ $room->id }}" {{ old('room_id') == $room->id ? 'selected' : '' }}>{{ $room->name }} (kapasitas {{ $room->capacity }})</option>
                    @endforeach
                </select>

                <label for="start_time">Waktu Mulai</label>
                <input id="start_time" type="datetime-local" name="start_time" value="{{ old('start_time') ? str_replace(' ', 'T', old('start_time')) : '' }}" required>

                <label for="end_time">Waktu Selesai</label>
                <input id="end_time" type="datetime-local" name="end_time" value="{{ old('end_time') ? str_replace(' ', 'T', old('end_time')) : '' }}" required>

                <label for="purpose">Tujuan Transaksi</label>
                <input id="purpose" type="text" name="purpose" value="{{ old('purpose') }}" required>

                <button type="submit" class="button">Simpan Transaksi</button>
            </form>

            <h2>Riwayat Transaksi Saya</h2>
            <div class="booking-list">
                @forelse($bookings as $booking)
                    <div class="booking-item">
                        <strong>{{ $booking->purpose }}</strong>
                        <p>{{ $booking->start_time->format('Y-m-d H:i') }} sampai {{ $booking->end_time->format('Y-m-d H:i') }}</p>
                        <p>Resource: {{ $booking->equipment?->name ?? $booking->room?->name ?? 'Tidak ada' }}</p>
                        <p>Status: {{ ucfirst(str_replace('_', ' ', $booking->status)) }}</p>
                    </div>
                @empty
                    <p>Tidak ada transaksi booking.</p>
                @endforelse
            </div>

            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit" class="button">Logout</button>
            </form>
        </div>
    </div>
</body>
</html>
