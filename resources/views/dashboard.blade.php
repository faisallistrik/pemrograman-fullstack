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

            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit" class="button">Logout</button>
            </form>
        </div>
    </div>
</body>
</html>
