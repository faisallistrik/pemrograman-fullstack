<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class EnsureApiTokenIsValid
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken() ?? $request->query('api_token');

        if (! $token || ! $user = User::where('api_token', $token)->first()) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        auth()->setUser($user);

        return $next($request);
    }
}
