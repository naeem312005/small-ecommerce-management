<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with demo data.
     */
    public function run(): void
    {
        // 1. Create System Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@ecommerce.com'],
            [
                'name' => 'Platform Administrator',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '+1 (555) 019-2831',
                'email_verified_at' => now(),
            ]
        );

        // 2. Create Shop Owners
        $ownerAlex = User::firstOrCreate(
            ['email' => 'tech@ecommerce.com'],
            [
                'name' => 'Alex Mercer',
                'password' => Hash::make('password123'),
                'role' => 'shop_owner',
                'phone' => '+1 (555) 782-9901',
                'email_verified_at' => now(),
            ]
        );

        $ownerSophia = User::firstOrCreate(
            ['email' => 'fashion@ecommerce.com'],
            [
                'name' => 'Sophia Bennett',
                'password' => Hash::make('password123'),
                'role' => 'shop_owner',
                'phone' => '+1 (555) 349-1120',
                'email_verified_at' => now(),
            ]
        );

        $ownerLiam = User::firstOrCreate(
            ['email' => 'living@ecommerce.com'],
            [
                'name' => 'Liam Vance',
                'password' => Hash::make('password123'),
                'role' => 'shop_owner',
                'phone' => '+1 (555) 890-4433',
                'email_verified_at' => now(),
            ]
        );

        $ownerEmma = User::firstOrCreate(
            ['email' => 'owner4@ecommerce.com'],
            [
                'name' => 'Emma Watson',
                'password' => Hash::make('password123'),
                'role' => 'shop_owner',
                'phone' => '+1 (555) 431-7788',
                'email_verified_at' => now(),
            ]
        );

        // 3. Create Demo Customer
        User::firstOrCreate(
            ['email' => 'customer@ecommerce.com'],
            [
                'name' => 'John Customer',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'phone' => '+1 (555) 678-1234',
                'email_verified_at' => now(),
            ]
        );

        // 4. Create Shops
        $shopTech = Shop::firstOrCreate(
            ['slug' => 'technova-gadgets'],
            [
                'user_id' => $ownerAlex->id,
                'name' => 'TechNova Gadgets',
                'description' => 'Premium consumer electronics, audio gear, and cutting-edge desktop peripherals curated for power users.',
                'logo' => 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
                'banner' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
                'email' => 'contact@technova.store',
                'phone' => '+1 (555) 782-9901',
                'address' => '742 Silicon Boulevard, Tech District, San Francisco, CA',
                'is_active' => true,
            ]
        );

        $shopFashion = Shop::firstOrCreate(
            ['slug' => 'aura-apparel'],
            [
                'user_id' => $ownerSophia->id,
                'name' => 'Aura Apparel & Co.',
                'description' => 'Contemporary sustainable fashion, minimalist daily essentials, and artisanal accessories designed for comfort.',
                'logo' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
                'banner' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
                'email' => 'concierge@auraclothing.com',
                'phone' => '+1 (555) 349-1120',
                'address' => '108 SoHo Fashion Avenue, New York, NY',
                'is_active' => true,
            ]
        );

        $shopLiving = Shop::firstOrCreate(
            ['slug' => 'nordic-living'],
            [
                'user_id' => $ownerLiam->id,
                'name' => 'Nordic Living & Studio',
                'description' => 'Handcrafted Scandinavian furniture, ceramic homeware, and ergonomic workspace items that elevate your interior.',
                'logo' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
                'banner' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
                'email' => 'hello@nordicliving.studio',
                'phone' => '+1 (555) 890-4433',
                'address' => '224 Fjord Street, Downtown Seattle, WA',
                'is_active' => true,
            ]
        );

        // 5. Shared Master Product Catalog
        // Requirement: "The application should support products created by both administrators and shop owners."
        // A. Products created by Admin
        $prodHeadphones = Product::firstOrCreate(
            ['sku' => 'PRD-TECH-01'],
            [
                'created_by' => $admin->id,
                'name' => 'Pro Wireless Active Noise-Cancelling Headphones',
                'slug' => 'pro-wireless-active-noise-cancelling-headphones',
                'category' => 'Electronics',
                'base_price' => 199.99,
                'thumbnail' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                'description' => 'Flagship wireless over-ear headphones featuring adaptive active noise cancellation, 40mm beryllium drivers, and up to 40 hours of playback.',
                'is_active' => true,
            ]
        );

        $prodMonitor = Product::firstOrCreate(
            ['sku' => 'PRD-TECH-02'],
            [
                'created_by' => $admin->id,
                'name' => 'Ultra-Slim 27-inch 4K HDR Gaming & Creator Display',
                'slug' => 'ultra-slim-27-inch-4k-hdr-gaming-display',
                'category' => 'Electronics',
                'base_price' => 449.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
                'description' => 'IPS Panel with 99% DCI-P3 color accuracy, 144Hz refresh rate, USB-C 90W power delivery, and ultra-thin bezels.',
                'is_active' => true,
            ]
        );

        $prodHoodie = Product::firstOrCreate(
            ['sku' => 'PRD-FASH-01'],
            [
                'created_by' => $admin->id,
                'name' => 'Organic Heavyweight Brushed Cotton Hoodie',
                'slug' => 'organic-heavyweight-brushed-cotton-hoodie',
                'category' => 'Fashion',
                'base_price' => 65.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
                'description' => 'Constructed from 450 GSM certified organic combed cotton. Pre-shrunk relaxed fit with double-needle ribbed hems.',
                'is_active' => true,
            ]
        );

        $prodBriefcase = Product::firstOrCreate(
            ['sku' => 'PRD-FASH-02'],
            [
                'created_by' => $admin->id,
                'name' => 'Full-Grain Artisan Leather Messenger Bag',
                'slug' => 'full-grain-artisan-leather-messenger-bag',
                'category' => 'Fashion',
                'base_price' => 145.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
                'description' => 'Hand-stitched vegetable-tanned leather with dedicated 16-inch laptop compartment and solid brass YKK hardware.',
                'is_active' => true,
            ]
        );

        $prodDeskOrganiser = Product::firstOrCreate(
            ['sku' => 'PRD-HOME-01'],
            [
                'created_by' => $admin->id,
                'name' => 'Solid American Walnut Desk Organizer Tray',
                'slug' => 'solid-american-walnut-desk-organizer-tray',
                'category' => 'Home & Living',
                'base_price' => 45.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80',
                'description' => 'Precision CNC-milled solid walnut with slots for smartphone, fountain pens, and desk stationery.',
                'is_active' => true,
            ]
        );

        // B. Products created by Shop Owner Alex Mercer (Shop: TechNova)
        // Requirement: "Shop owners can create their own products, which should also become available in the shared catalog."
        $prodKeyboard = Product::firstOrCreate(
            ['sku' => 'PRD-TECH-03'],
            [
                'created_by' => $ownerAlex->id,
                'name' => 'Compact 75% Hot-Swappable Mechanical Keyboard',
                'slug' => 'compact-75-percent-hot-swappable-mechanical-keyboard',
                'category' => 'Electronics',
                'base_price' => 95.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
                'description' => 'Gasket-mounted mechanical keyboard with pre-lubed linear switches, sound-dampening foam, and multi-device Bluetooth 5.2.',
                'is_active' => true,
            ]
        );

        $prodMagCharge = Product::firstOrCreate(
            ['sku' => 'PRD-TECH-04'],
            [
                'created_by' => $ownerAlex->id,
                'name' => 'MagCharge 3-in-1 Foldable Magnetic Fast Charging Hub',
                'slug' => 'magcharge-3-in-1-foldable-magnetic-charging-hub',
                'category' => 'Electronics',
                'base_price' => 49.99,
                'thumbnail' => 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
                'description' => 'Simultaneously charge phone, smartwatch, and wireless earbuds with 15W Qi-certified rapid charging in aluminum alloy housing.',
                'is_active' => true,
            ]
        );

        // C. Products created by Shop Owner Sophia Bennett (Shop: Aura Apparel)
        $prodWindbreaker = Product::firstOrCreate(
            ['sku' => 'PRD-FASH-03'],
            [
                'created_by' => $ownerSophia->id,
                'name' => 'All-Weather Waterproof Packable Windbreaker',
                'slug' => 'all-weather-waterproof-packable-windbreaker',
                'category' => 'Fashion',
                'base_price' => 89.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
                'description' => 'Ultra-lightweight ripstop nylon with DWR waterproof coating, taped seams, and interior zip-into-pouch conversion.',
                'is_active' => true,
            ]
        );

        $prodTote = Product::firstOrCreate(
            ['sku' => 'PRD-FASH-04'],
            [
                'created_by' => $ownerSophia->id,
                'name' => 'Recycled Heavy Canvas Everyday Commuter Tote',
                'slug' => 'recycled-heavy-canvas-everyday-commuter-tote',
                'category' => 'Fashion',
                'base_price' => 34.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
                'description' => '16oz recycled canvas with reinforced double handles, internal water bottle sleeve, and zipped security pocket.',
                'is_active' => true,
            ]
        );

        // D. Products created by Shop Owner Liam Vance (Shop: Nordic Living)
        $prodMugSet = Product::firstOrCreate(
            ['sku' => 'PRD-HOME-02'],
            [
                'created_by' => $ownerLiam->id,
                'name' => 'Handcrafted Matte Ceramic Coffee Mug & Saucer Set',
                'slug' => 'handcrafted-matte-ceramic-coffee-mug-saucer-set',
                'category' => 'Home & Living',
                'base_price' => 38.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'description' => 'Set of 2 hand-thrown stoneware ceramic mugs with textured speckled glaze and ergonomic curved handle.',
                'is_active' => true,
            ]
        );

        $prodLamp = Product::firstOrCreate(
            ['sku' => 'PRD-HOME-03'],
            [
                'created_by' => $ownerLiam->id,
                'name' => 'Nordic Minimalist Dimmable Oak Bedside Lamp',
                'slug' => 'nordic-minimalist-dimmable-oak-bedside-lamp',
                'category' => 'Home & Living',
                'base_price' => 79.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
                'description' => 'Solid natural oak base paired with frosted opal glass sphere and stepless brass touch dimmer control.',
                'is_active' => true,
            ]
        );

        // E. UNASSIGNED PRODUCTS IN CATALOG (Critical Requirement Verification!)
        // Requirement: "Products that are not assigned to any shop must not be visible to customers."
        Product::firstOrCreate(
            ['sku' => 'PRD-UNASSIGNED-01'],
            [
                'created_by' => $admin->id,
                'name' => '[UNASSIGNED CATALOG ITEM] Prototype Autonomous 8K Cinematic Drone',
                'slug' => 'prototype-autonomous-8k-cinematic-drone',
                'category' => 'Electronics',
                'base_price' => 1299.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
                'description' => 'This product exists in the shared master catalog but has intentionally NOT been assigned to any shop. It must NEVER be visible in customer storefronts.',
                'is_active' => true,
            ]
        );

        Product::firstOrCreate(
            ['sku' => 'PRD-UNASSIGNED-02'],
            [
                'created_by' => $ownerSophia->id,
                'name' => '[UNASSIGNED CATALOG ITEM] Limited Edition Italian Cashmere Overcoat',
                'slug' => 'limited-edition-italian-cashmere-overcoat',
                'category' => 'Fashion',
                'base_price' => 590.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
                'description' => 'Created by Sophia Bennett in catalog but not yet assigned to any shop. Proves catalog isolation.',
                'is_active' => true,
            ]
        );

        // 6. Shop-Specific Product Assignments (ShopProduct)
        // Demonstrating:
        // - Setting custom prices
        // - Setting custom details/descriptions
        // - Setting custom thumbnails
        // - Cross-shop listing from shared catalog

        // TechNova Assignments
        ShopProduct::firstOrCreate(
            ['shop_id' => $shopTech->id, 'product_id' => $prodHeadphones->id],
            [
                'price' => 189.99, // TechNova offers a $10 discount!
                'custom_title' => 'TechNova Audio Elite - Wireless ANC Headphones (Black)',
                'custom_description' => 'Curated by TechNova audio engineers: Includes free protective hard case and custom EQ sound presets for audiophiles.',
                'custom_thumbnail' => 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
                'stock' => 38,
                'is_available' => true,
            ]
        );

        ShopProduct::firstOrCreate(
            ['shop_id' => $shopTech->id, 'product_id' => $prodMonitor->id],
            [
                'price' => 439.00, // Custom shop price
                'custom_title' => 'TechNova 27" ProCreator 4K Monitor Bundle',
                'custom_description' => 'Zero dead pixel guarantee with high-speed 8K HDMI cable included.',
                'custom_thumbnail' => null, // Falls back to master thumbnail
                'stock' => 15,
                'is_available' => true,
            ]
        );

        ShopProduct::firstOrCreate(
            ['shop_id' => $shopTech->id, 'product_id' => $prodKeyboard->id],
            [
                'price' => 95.00,
                'custom_title' => null,
                'custom_description' => 'Equipped with custom Gateron Oil King linear switches and PBT dye-sub caps.',
                'custom_thumbnail' => null,
                'stock' => 24,
                'is_available' => true,
            ]
        );

        ShopProduct::firstOrCreate(
            ['shop_id' => $shopTech->id, 'product_id' => $prodMagCharge->id],
            [
                'price' => 49.99,
                'custom_title' => null,
                'custom_description' => null,
                'custom_thumbnail' => null,
                'stock' => 50,
                'is_available' => true,
            ]
        );

        // Aura Apparel Assignments
        // Note: Aura Apparel also lists the SAME headphones from shared catalog, but customized for luxury lifestyle!
        ShopProduct::firstOrCreate(
            ['shop_id' => $shopFashion->id, 'product_id' => $prodHeadphones->id],
            [
                'price' => 219.00, // Higher price boutique bundle
                'custom_title' => 'Aura Studio Edition Matte Black Wireless Headphones',
                'custom_description' => 'Fashion meets acoustic perfection. Shipped in signature embossed Aura luxury gift packaging with soft vegan suede travel pouch.',
                'custom_thumbnail' => 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
                'stock' => 12,
                'is_available' => true,
            ]
        );

        ShopProduct::firstOrCreate(
            ['shop_id' => $shopFashion->id, 'product_id' => $prodHoodie->id],
            [
                'price' => 62.00,
                'custom_title' => 'Aura Essential Organic Brushed Cotton Hoodie',
                'custom_description' => 'Everyday luxury streetwear. Ethically manufactured with zero chemical dyes in natural oatmeal and coal grey.',
                'custom_thumbnail' => null,
                'stock' => 45,
                'is_available' => true,
            ]
        );

        ShopProduct::firstOrCreate(
            ['shop_id' => $shopFashion->id, 'product_id' => $prodBriefcase->id],
            [
                'price' => 145.00,
                'custom_title' => null,
                'custom_description' => 'Treated with water-resistant beeswax conditioner before dispatch.',
                'custom_thumbnail' => null,
                'stock' => 18,
                'is_available' => true,
            ]
        );

        ShopProduct::firstOrCreate(
            ['shop_id' => $shopFashion->id, 'product_id' => $prodWindbreaker->id],
            [
                'price' => 89.00,
                'custom_title' => null,
                'custom_description' => null,
                'custom_thumbnail' => null,
                'stock' => 28,
                'is_available' => true,
            ]
        );

        ShopProduct::firstOrCreate(
            ['shop_id' => $shopFashion->id, 'product_id' => $prodTote->id],
            [
                'price' => 32.00,
                'custom_title' => null,
                'custom_description' => null,
                'custom_thumbnail' => null,
                'stock' => 60,
                'is_available' => true,
            ]
        );

        // Nordic Living Assignments
        ShopProduct::firstOrCreate(
            ['shop_id' => $shopLiving->id, 'product_id' => $prodDeskOrganiser->id],
            [
                'price' => 45.00,
                'custom_title' => 'Nordic Solid Walnut Desk Valet & Caddy',
                'custom_description' => 'Each tray features unique natural wood grain patterns. Hand-oiled in our Seattle woodshop.',
                'custom_thumbnail' => null,
                'stock' => 20,
                'is_available' => true,
            ]
        );

        ShopProduct::firstOrCreate(
            ['shop_id' => $shopLiving->id, 'product_id' => $prodMugSet->id],
            [
                'price' => 38.00,
                'custom_title' => null,
                'custom_description' => 'Dishwasher and microwave safe. Microwave safe glaze with artisanal raw clay base.',
                'custom_thumbnail' => null,
                'stock' => 30,
                'is_available' => true,
            ]
        );

        ShopProduct::firstOrCreate(
            ['shop_id' => $shopLiving->id, 'product_id' => $prodLamp->id],
            [
                'price' => 75.00,
                'custom_title' => 'Nordic Scandi Amber Glow Bedside Sphere Lamp',
                'custom_description' => 'Warm 2700K ambient LED warm glow with braided fabric cable.',
                'custom_thumbnail' => null,
                'stock' => 14,
                'is_available' => true,
            ]
        );
    }
}
