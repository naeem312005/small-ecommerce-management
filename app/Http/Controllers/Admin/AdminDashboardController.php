<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_shops' => Shop::count(),
            'active_shops' => Shop::where('is_active', true)->count(),
            'total_products' => Product::count(),
            'active_products' => Product::where('is_active', true)->count(),
            'total_shop_owners' => User::where('role', 'shop_owner')->count(),
            'total_shop_listings' => ShopProduct::count(),
        ];

        $recentShops = Shop::with('owner:id,name,email')
            ->withCount('shopProducts')
            ->latest()
            ->take(5)
            ->get();

        $recentProducts = Product::with('creator:id,name,role')
            ->withCount('shopProducts')
            ->latest()
            ->take(5)
            ->get();

        $recentOwners = User::where('role', 'shop_owner')
            ->withCount('shops')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentShops' => $recentShops,
            'recentProducts' => $recentProducts,
            'recentOwners' => $recentOwners,
        ]);
    }
}
