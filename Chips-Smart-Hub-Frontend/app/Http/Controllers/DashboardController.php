<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $token = $request->cookie('api_token');

        if (! $token) {
            return redirect('/login');
        }

        $apiBaseUrl = rtrim(env('VITE_API_BASE_URL', 'http://localhost:8000/api'), '/');

        $meResponse = Http::withToken($token)->get("{$apiBaseUrl}/me");
        $statsResponse = Http::withToken($token)->get("{$apiBaseUrl}/dashboard/stats");

        if ($meResponse->failed() || $statsResponse->failed()) {
            return redirect('/login');
        }

        return Inertia::render('Dashboard', [
            'user' => $meResponse->json(),
            'stats' => $statsResponse->json(),
        ])->rootView('inertia');
    }
}
