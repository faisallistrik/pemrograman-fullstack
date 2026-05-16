<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chips Smart-Hub Management System</title>
    <style>
        body {
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            margin: 0;
            padding: 0;
            background: #111;
            color: #f8f8f8;
        }
        .page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            padding: 2rem;
        }
        .card {
            background: rgba(255, 255, 255, .05);
            border: 1px solid rgba(255, 255, 255, .1);
            border-radius: 18px;
            max-width: 900px;
            width: 100%;
            padding: 2rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, .35);
        }
        h1 {
            margin: 0;
            font-size: clamp(2rem, 3vw, 3.2rem);
            letter-spacing: -.03em;
        }
        p {
            margin: .75rem 0 0;
            line-height: 1.75;
            opacity: .85;
        }
        ul {
            margin: 1rem 0 0;
            padding-left: 1.3rem;
        }
        li {
            margin: .5rem 0;
        }
        a {
            color: #7dd3fc;
            text-decoration: none;
        }
        .button {
            display: inline-flex;
            margin-top: 1.5rem;
            padding: 0.95rem 1.4rem;
            border-radius: 999px;
            background: linear-gradient(135deg, #38bdf8, #0ea5e9);
            color: #020617;
            font-weight: 700;
            text-decoration: none;
        }
        .note {
            margin-top: 1.5rem;
            padding: 1rem;
            border-left: 4px solid #38bdf8;
            background: rgba(56, 189, 248, .08);
            color: #dbeafe;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="card">
            <h1>Chips Smart-Hub Management System</h1>
            <p>Backend API Laravel untuk manajemen peminjaman ruang kerja, inventory equipment, dan check-in studio.</p>
            <p>API root: <code>/api</code></p>

            <h2>Endpoint Utama</h2>
            <ul>
                <li><strong>Public:</strong> <code>POST /api/login</code>, <code>POST /api/register</code></li>
                <li><strong>Auth:</strong> <code>GET /api/me</code>, <code>POST /api/logout</code></li>
                <li><strong>Equipment:</strong> <code>GET /api/equipment</code>, <code>POST /api/equipment</code>, <code>PUT /api/equipment/{id}</code></li>
                <li><strong>Rooms:</strong> <code>GET /api/rooms</code>, <code>POST /api/rooms</code>, <code>PUT /api/rooms/{id}</code></li>
                <li><strong>Bookings:</strong> <code>GET /api/bookings</code>, <code>POST /api/bookings</code>, <code>POST /api/bookings/{id}/check-in</code></li>
            </ul>

            <a class="button" href="{{ route('login') }}">Login ke SmartHub</a>

            <div class="note">
                <strong>Catatan:</strong> Route root sekarang diarahkan ke halaman SmartHub ini. Jika Anda ingin memanggil API, gunakan <code>/api/...</code>.
            </div>
        </div>
    </div>
</body>
</html>
