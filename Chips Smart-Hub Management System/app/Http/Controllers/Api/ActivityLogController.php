<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        return ActivityLog::with('user')
            ->orderByDesc('created_at')
            ->paginate((int) $request->query('per_page', 20));
    }
}
