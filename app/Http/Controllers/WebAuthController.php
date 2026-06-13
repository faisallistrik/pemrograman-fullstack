<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Equipment;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WebAuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'Email atau password salah'])->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function dashboard()
    {
        $equipments = Equipment::orderBy('name')->get();
        $rooms = Room::orderBy('name')->get();
        $bookings = auth()->user()->bookings()->with(['equipment', 'room'])->latest()->get();

        return view('dashboard', compact('equipments', 'rooms', 'bookings'));
    }

    public function storeTransaction(Request $request)
    {
        $data = $request->validate([
            'equipment_id' => ['nullable', 'exists:equipment,id'],
            'room_id' => ['nullable', 'exists:rooms,id'],
            'start_time' => ['required', 'date', 'after_or_equal:now'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'purpose' => ['required', 'string', 'max:255'],
        ]);

        if (empty($data['equipment_id']) && empty($data['room_id'])) {
            return back()->withErrors(['transaction' => 'Pilih equipment atau ruangan untuk transaksi.'])->withInput();
        }

        if (! empty($data['equipment_id'])) {
            $equipment = Equipment::find($data['equipment_id']);
            if ($equipment && $equipment->quantity < 1) {
                return back()->withErrors(['equipment_id' => 'Kuantitas equipment tidak mencukupi.'])->withInput();
            }
        }

        Booking::create([
            'user_id' => auth()->id(),
            'equipment_id' => $data['equipment_id'] ?? null,
            'room_id' => $data['room_id'] ?? null,
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'purpose' => $data['purpose'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Transaksi booking berhasil dibuat.');
    }
}
