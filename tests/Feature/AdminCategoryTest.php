<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCategoryTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $shopOwner;

    protected User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'email' => 'admin@test.com',
            'role' => 'admin',
        ]);

        $this->shopOwner = User::factory()->create([
            'email' => 'owner@test.com',
            'role' => 'shop_owner',
        ]);

        $this->customer = User::factory()->create([
            'email' => 'customer@test.com',
            'role' => 'customer',
        ]);
    }

    public function test_admin_can_view_categories_index(): void
    {
        Category::create([
            'name' => 'Audio Gear',
            'slug' => 'audio-gear',
            'description' => 'Headphones and speakers',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.categories.index'));

        $response->assertOk();
        $response->assertSee('Audio Gear');
    }

    public function test_non_admin_cannot_access_categories_management(): void
    {
        $response = $this->actingAs($this->shopOwner)->get(route('admin.categories.index'));
        $response->assertForbidden();

        $response = $this->actingAs($this->customer)->get(route('admin.categories.index'));
        $response->assertForbidden();
    }

    public function test_admin_can_view_create_category_form(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.categories.create'));
        $response->assertOk();
    }

    public function test_admin_can_create_new_category(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), [
            'name' => 'Smart Home',
            'slug' => 'smart-home',
            'description' => 'Smart home and connected living devices',
            'icon' => 'Home',
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('categories', [
            'name' => 'Smart Home',
            'slug' => 'smart-home',
            'icon' => 'Home',
            'is_active' => true,
        ]);
    }

    public function test_category_requires_unique_name(): void
    {
        Category::create([
            'name' => 'Wearables',
            'slug' => 'wearables',
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), [
            'name' => 'Wearables',
            'slug' => 'wearables-2',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_admin_can_view_edit_category_form(): void
    {
        $category = Category::create([
            'name' => 'Gaming Peripherals',
            'slug' => 'gaming-peripherals',
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.categories.edit', $category));
        $response->assertOk();
        $response->assertSee('Gaming Peripherals');
    }

    public function test_admin_can_update_category(): void
    {
        $category = Category::create([
            'name' => 'Outdoor',
            'slug' => 'outdoor',
            'description' => 'Old description',
        ]);

        $response = $this->actingAs($this->admin)->put(route('admin.categories.update', $category), [
            'name' => 'Outdoor & Adventure',
            'slug' => 'outdoor-adventure',
            'description' => 'Updated outdoor gear description',
            'icon' => 'Activity',
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Outdoor & Adventure',
            'slug' => 'outdoor-adventure',
            'icon' => 'Activity',
        ]);
    }

    public function test_admin_can_delete_category_and_unlink_products(): void
    {
        $category = Category::create([
            'name' => 'Temporary Cat',
            'slug' => 'temp-cat',
        ]);

        $product = Product::create([
            'created_by' => $this->admin->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-SKU-01',
            'category_id' => $category->id,
            'category' => 'Temporary Cat',
            'base_price' => 29.99,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.categories.destroy', $category));

        $response->assertRedirect(route('admin.categories.index'));
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);

        // Product is preserved, only category_id is unlinked
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'category_id' => null,
        ]);
    }
}
