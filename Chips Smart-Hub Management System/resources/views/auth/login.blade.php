<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Chips Smart-Hub Management System</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at top, #0f172a 0%, #020617 100%);
            color: #e2e8f0;
            font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }
        .card {
            width: min(420px, calc(100vw - 2rem));
            padding: 2rem;
            border-radius: 24px;
            background: rgba(15, 23, 42, .95);
            box-shadow: 0 30px 90px rgba(15, 23, 42, .35);
            border: 1px solid rgba(148, 163, 184, .12);
        }
        h1 {
            margin: 0 0 1rem;
            font-size: 2rem;
            color: #f8fafc;
        }
        p {
            margin: 0 0 1.5rem;
            color: #cbd5e1;
            line-height: 1.7;
        }
        label {
            display: block;
            margin-top: 1rem;
            font-size: .95rem;
            color: #cbd5e1;
        }
        input {
            width: 100%;
            margin-top: .5rem;
            padding: .95rem 1rem;
            border-radius: 14px;
            border: 1px solid rgba(148, 163, 184, .12);
            background: rgba(15, 23, 42, .9);
            color: #f8fafc;
            font-size: 1rem;
        }
        button {
            width: 100%;
            margin-top: 1.5rem;
            padding: 1rem;
            border: none;
            border-radius: 14px;
            background: linear-gradient(135deg, #38bdf8, #0ea5e9);
            color: #020617;
            font-weight: 700;
            cursor: pointer;
            transition: transform .2s ease, filter .2s ease;
        }
        button:hover {
            transform: translateY(-1px);
            filter: brightness(1.05);
        }
        .error {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 14px;
            background: rgba(248, 113, 113, .12);
            color: #fecaca;
            border: 1px solid rgba(248, 113, 113, .22);
        }
        .link {
            margin-top: 1.5rem;
            font-size: .95rem;
            color: #94a3b8;
        }
        .link a {
            color: #38bdf8;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Login Smart-Hub</h1>
        <p>Masuk menggunakan akun admin atau member yang disiapkan untuk proyek.</p>

        @if ($errors->any())
            <div class="error">
                <strong>Terjadi kesalahan:</strong>
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <label for="email">Email</label>
            <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus>

            <label for="password">Password</label>
            <input id="password" type="password" name="password" required>

            <label>
                <input type="checkbox" name="remember"> Ingat saya
            </label>

            <button type="submit">Masuk</button>
        </form>

        <p class="link">Akun yang tersedia: <strong>admin@smart-hub.local</strong> / <strong>member@smart-hub.local</strong> dengan password <strong>password</strong>.</p>
    </div>
</body>
</html>
