<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register_with_static_otp(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'otp' => '123456',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::where('email', 'test@example.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasVerifiedEmail());

        // Ensure user can access dashboard without being blocked by verified middleware
        $dashboardResponse = $this->get(route('dashboard'));
        $dashboardResponse->assertRedirect(route('home'));
    }

    public function test_registration_requires_otp(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test2@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors(['otp']);
        $this->assertGuest();
    }

    public function test_registration_rejects_invalid_otp(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test3@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'otp' => '999999',
        ]);

        $response->assertSessionHasErrors(['otp']);
        $this->assertGuest();
    }

    public function test_registration_otp_dispatch_endpoint(): void
    {
        $response = $this->postJson(route('register.send-otp'), [
            'name' => 'Demo Shopper',
            'email' => 'shopper@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'otp' => '123456',
        ]);
        $this->assertEquals('123456', session('registration_otp'));
    }
}
