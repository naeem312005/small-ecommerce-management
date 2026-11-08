<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_admin_is_redirected_to_admin_dashboard()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('admin.dashboard'));
    }

    public function test_shop_owner_is_redirected_to_shop_owner_dashboard()
    {
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $this->actingAs($owner);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('shop-owner.dashboard'));
    }
}
