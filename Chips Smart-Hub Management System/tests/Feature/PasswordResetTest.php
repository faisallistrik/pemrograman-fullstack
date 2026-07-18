<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_creates_reset_token_for_existing_user(): void
    {
        $user = User::factory()->create(['email' => 'reset@example.com']);

        $this->postJson('/api/forgot-password', ['email' => 'reset@example.com'])
            ->assertStatus(200);

        $this->assertDatabaseHas('password_reset_tokens', ['email' => 'reset@example.com']);
    }

    public function test_forgot_password_gives_generic_response_for_unknown_email(): void
    {
        $this->postJson('/api/forgot-password', ['email' => 'unknown@example.com'])
            ->assertStatus(200);

        $this->assertDatabaseMissing('password_reset_tokens', ['email' => 'unknown@example.com']);
    }

    public function test_reset_password_with_valid_token_updates_password(): void
    {
        $user = User::factory()->create(['email' => 'reset2@example.com']);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make('plain-token-123'),
            'created_at' => Carbon::now(),
        ]);

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => 'plain-token-123',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);

        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
        $this->assertDatabaseMissing('password_reset_tokens', ['email' => $user->email]);
    }

    public function test_reset_password_with_invalid_token_fails(): void
    {
        $user = User::factory()->create(['email' => 'reset3@example.com']);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make('correct-token'),
            'created_at' => Carbon::now(),
        ]);

        $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => 'wrong-token',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ])->assertStatus(422);
    }

    public function test_reset_password_with_expired_token_fails(): void
    {
        $user = User::factory()->create(['email' => 'reset4@example.com']);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make('plain-token-456'),
            'created_at' => Carbon::now()->subHours(2),
        ]);

        $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => 'plain-token-456',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ])->assertStatus(422);
    }
}
