<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EcommerceManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $shopOwner1;

    protected User $shopOwner2;

    protected Shop $shop1;

    protected Shop $shop2;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->admin = User::factory()->create([
            'email' => 'admin@test.com',
            'role' => 'admin',
        ]);

        $this->shopOwner1 = User::factory()->create([
            'email' => 'owner1@test.com',
            'role' => 'shop_owner',
        ]);

        $this->shopOwner2 = User::factory()->create([
            'email' => 'owner2@test.com',
            'role' => 'shop_owner',
        ]);

        $this->shop1 = Shop::create([
            'user_id' => $this->shopOwner1->id,
            'name' => 'Alpha Shop',
            'slug' => 'alpha-shop',
            'description' => 'Alpha description',
            'is_active' => true,
        ]);

        $this->shop2 = Shop::create([
            'user_id' => $this->shopOwner2->id,
            'name' => 'Beta Boutique',
            'slug' => 'beta-boutique',
            'description' => 'Beta description',
            'is_active' => true,
        ]);
    }

    /** Requirement 1: Admin Authentication & Shop Management (CRUD) */
    public function test_admin_can_create_and_manage_shops(): void
    {
        $this->actingAs($this->admin);

        // 1. Visit index
        $res = $this->get(route('admin.shops.index'));
        $res->assertOk();

        // 2. Store new shop
        $storeRes = $this->post(route('admin.shops.store'), [
            'user_id' => $this->shopOwner1->id,
            'name' => 'Gamma Electronics',
            'description' => 'Top tier tech gadgets',
            'email' => 'gamma@tech.com',
            'phone' => '1234567890',
            'address' => 'Silicon Valley, CA',
            'is_active' => 1,
        ]);
        $storeRes->assertRedirect(route('admin.shops.index'));
        $this->assertDatabaseHas('shops', ['name' => 'Gamma Electronics']);

        // 3. Update shop
        $gamma = Shop::where('name', 'Gamma Electronics')->first();
        $updateRes = $this->put(route('admin.shops.update', $gamma->id), [
            'user_id' => $this->shopOwner1->id,
            'name' => 'Gamma Electronics Pro',
            'description' => 'Updated description',
            'is_active' => 1,
        ]);
        $updateRes->assertRedirect(route('admin.shops.index'));
        $this->assertDatabaseHas('shops', ['name' => 'Gamma Electronics Pro']);

        // 4. Delete shop
        $delRes = $this->delete(route('admin.shops.destroy', $gamma->id));
        $delRes->assertRedirect(route('admin.shops.index'));
        $this->assertDatabaseMissing('shops', ['id' => $gamma->id]);
    }

    /** Requirement 2: Admin Master Product Management (CRUD) */
    public function test_admin_can_manage_master_products(): void
    {
        $this->actingAs($this->admin);

        // Store master product
        $res = $this->post(route('admin.products.store'), [
            'name' => 'Noise-Cancelling Earbuds',
            'sku' => 'PRD-EAR-01',
            'category' => 'Electronics',
            'base_price' => 129.99,
            'description' => 'Crystal clear audio',
            'is_active' => 1,
        ]);
        $res->assertRedirect(route('admin.products.index'));

        $this->assertDatabaseHas('products', [
            'sku' => 'PRD-EAR-01',
            'created_by' => $this->admin->id,
        ]);

        $product = Product::where('sku', 'PRD-EAR-01')->first();

        // Update product
        $updateRes = $this->put(route('admin.products.update', $product->id), [
            'name' => 'Noise-Cancelling Earbuds v2',
            'sku' => 'PRD-EAR-01',
            'category' => 'Electronics',
            'base_price' => 149.99,
            'description' => 'Updated specs',
            'is_active' => 1,
        ]);
        $updateRes->assertRedirect(route('admin.products.index'));
        $this->assertDatabaseHas('products', ['base_price' => 149.99]);
    }

    /** Requirement 3: Admin Can Create & Manage Shop Owner Accounts */
    public function test_admin_can_manage_shop_owner_accounts(): void
    {
        $this->actingAs($this->admin);

        $res = $this->post(route('admin.shop-owners.store'), [
            'name' => 'Merchant Dave',
            'email' => 'dave@merchant.com',
            'phone' => '555-1234',
            'password' => 'password123',
        ]);
        $res->assertRedirect(route('admin.shop-owners.index'));

        $this->assertDatabaseHas('users', [
            'email' => 'dave@merchant.com',
            'role' => 'shop_owner',
        ]);
    }

    /** Requirement 4 & 5: Products created by admin or other shop owners are available in shared catalog */
    public function test_shared_catalog_contains_products_from_admin_and_other_shop_owners(): void
    {
        // Product created by Admin
        $adminProduct = Product::create([
            'created_by' => $this->admin->id,
            'name' => 'Admin Wireless Router',
            'slug' => 'admin-wireless-router',
            'sku' => 'PRD-RT-01',
            'category' => 'Electronics',
            'base_price' => 89.00,
            'is_active' => true,
        ]);

        // Product created by Shop Owner 2
        $owner2Product = Product::create([
            'created_by' => $this->shopOwner2->id,
            'name' => 'Owner2 Silk Scarf',
            'slug' => 'owner2-silk-scarf',
            'sku' => 'PRD-SCF-01',
            'category' => 'Fashion',
            'base_price' => 35.00,
            'is_active' => true,
        ]);

        // Shop Owner 1 browses the shared catalog
        $this->actingAs($this->shopOwner1);
        $catalogRes = $this->get(route('shop-owner.catalog.index'));
        $catalogRes->assertOk();

        // Shop Owner 1 adds Admin's product to Shop 1 with custom price
        $addRes = $this->post(route('shop-owner.catalog.add', $adminProduct->id), [
            'price' => 79.99, // Discounted custom shop price!
            'stock' => 20,
            'custom_title' => 'Alpha Ultra Fast WiFi Router',
        ]);
        $addRes->assertRedirect(route('shop-owner.products.index'));

        $this->assertDatabaseHas('shop_products', [
            'shop_id' => $this->shop1->id,
            'product_id' => $adminProduct->id,
            'price' => 79.99,
            'custom_title' => 'Alpha Ultra Fast WiFi Router',
        ]);

        // Shop Owner 1 ALSO adds Owner 2's product to Shop 1
        $addRes2 = $this->post(route('shop-owner.catalog.add', $owner2Product->id), [
            'price' => 45.00, // Premium markup!
            'stock' => 10,
        ]);
        $addRes2->assertRedirect(route('shop-owner.products.index'));

        $this->assertDatabaseHas('shop_products', [
            'shop_id' => $this->shop1->id,
            'product_id' => $owner2Product->id,
            'price' => 45.00,
        ]);
    }

    /** Requirement 6: Shop owners can create their own products which enter shared catalog */
    public function test_shop_owners_can_create_products_which_become_shared_catalog_items(): void
    {
        $this->actingAs($this->shopOwner1);

        $res = $this->post(route('shop-owner.catalog.store'), [
            'name' => 'Alpha Custom Mechanical Switch',
            'sku' => 'PRD-SW-99',
            'category' => 'Electronics',
            'base_price' => 29.99,
            'description' => 'Precision switches',
            'add_to_my_shop' => 1,
            'shop_price' => 25.00,
            'shop_stock' => 100,
        ]);

        $res->assertRedirect(route('shop-owner.products.index'));

        // Verify it was added to the master products catalog with created_by = shopOwner1
        $this->assertDatabaseHas('products', [
            'sku' => 'PRD-SW-99',
            'created_by' => $this->shopOwner1->id,
        ]);

        $newProduct = Product::where('sku', 'PRD-SW-99')->first();

        // Verify it is also listed in shopOwner1's shop
        $this->assertDatabaseHas('shop_products', [
            'shop_id' => $this->shop1->id,
            'product_id' => $newProduct->id,
            'price' => 25.00,
        ]);

        // Verify Shop Owner 2 can see this new product in the shared catalog!
        $this->actingAs($this->shopOwner2);
        $resOwner2 = $this->get(route('shop-owner.catalog.index'));
        $resOwner2->assertOk();
    }

    /** Requirement 7: Shop owners can set or modify product prices, details, and thumbnails */
    public function test_shop_owners_can_modify_price_details_and_thumbnail_for_their_shop(): void
    {
        $product = Product::create([
            'created_by' => $this->admin->id,
            'name' => 'Desk Mat',
            'slug' => 'desk-mat',
            'sku' => 'PRD-MAT-01',
            'category' => 'Home & Living',
            'base_price' => 25.00,
            'is_active' => true,
        ]);

        $shopProduct = ShopProduct::create([
            'shop_id' => $this->shop1->id,
            'product_id' => $product->id,
            'price' => 25.00,
            'stock' => 10,
            'is_available' => true,
        ]);

        $this->actingAs($this->shopOwner1);

        $fakeImage = UploadedFile::fake()->image('custom-thumbnail.jpg');

        $updateRes = $this->post(route('shop-owner.products.update', $shopProduct->id), [
            'price' => 32.50,
            'custom_title' => 'Alpha Premium Felt Desk Mat XXL',
            'custom_description' => 'High quality wool felt desk mat',
            'stock' => 15,
            'is_available' => 1,
            'custom_thumbnail' => $fakeImage,
        ]);

        $updateRes->assertRedirect(route('shop-owner.products.index'));

        $shopProduct->refresh();
        $this->assertEquals('32.50', $shopProduct->price);
        $this->assertEquals('Alpha Premium Felt Desk Mat XXL', $shopProduct->custom_title);
        $this->assertEquals('High quality wool felt desk mat', $shopProduct->custom_description);
        $this->assertNotNull($shopProduct->custom_thumbnail);
        $this->assertEquals(15, $shopProduct->stock);
    }

    /** Requirement 8 & 9: Customer View - Customers ONLY see assigned products; unassigned products are hidden */
    public function test_customers_only_see_assigned_products_and_unassigned_products_are_hidden(): void
    {
        // 1. Create an assigned product in Shop 1
        $assignedProduct = Product::create([
            'created_by' => $this->admin->id,
            'name' => 'Assigned Smart Light',
            'slug' => 'assigned-smart-light',
            'sku' => 'PRD-LGT-01',
            'category' => 'Electronics',
            'base_price' => 40.00,
            'is_active' => true,
        ]);

        $shopProduct = ShopProduct::create([
            'shop_id' => $this->shop1->id,
            'product_id' => $assignedProduct->id,
            'price' => 38.00,
            'custom_title' => 'Alpha Ambient Smart Light',
            'stock' => 10,
            'is_available' => true,
        ]);

        // 2. Create an unassigned product in the shared catalog
        $unassignedProduct = Product::create([
            'created_by' => $this->admin->id,
            'name' => 'Secret Prototype Unassigned Product',
            'slug' => 'secret-prototype-unassigned',
            'sku' => 'PRD-SECRET-01',
            'category' => 'Electronics',
            'base_price' => 999.00,
            'is_active' => true,
        ]);

        // Customer visits public home showcase
        $response = $this->get(route('home'));
        $response->assertOk();

        // Inspect props passed to Inertia
        $response->assertInertia(fn ($page) => $page->component('Customer/Home')
            ->has('shopProducts.data', 1)
            ->where('shopProducts.data.0.id', $shopProduct->id)
            ->where('shopProducts.data.0.display_title', 'Alpha Ambient Smart Light')
        );

        // Verify unassigned product cannot be accessed via shop route
        $invalidProductRes = $this->get("/shops/alpha-shop/products/{$unassignedProduct->id}");
        $invalidProductRes->assertNotFound();

        // Verify assigned product CAN be accessed with shop-specific details
        $validProductRes = $this->get("/shops/alpha-shop/products/{$shopProduct->id}");
        $validProductRes->assertOk();
        $validProductRes->assertInertia(fn ($page) => $page->component('Customer/ProductShow')
            ->where('shopProduct.price', '38.00')
            ->where('shopProduct.display_title', 'Alpha Ambient Smart Light')
        );
    }
}
