<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopOwnerDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $shops = $user->shops()->get();
        $selectedShopId = $request->query('shop_id', session('active_shop_id'));

        /** @var Shop|null $currentShop */
        $currentShop = $shops->firstWhere('id', $selectedShopId) ?? $shops->first();

        if ($currentShop) {
            session(['active_shop_id' => $currentShop->id]);
        }

        $shopStats = null;
        $recentListings = [];
        $availableCatalogCount = 0;

        if ($currentShop) {
            $shopStats = [
                'total_products' => $currentShop->shopProducts()->count(),
                'active_products' => $currentShop->shopProducts()->where('is_available', true)->count(),
                'out_of_stock' => $currentShop->shopProducts()->where('stock', '<=', 0)->count(),
            ];

            $recentListings = $currentShop->shopProducts()
                ->with('product:id,name,sku,category,base_price,thumbnail')
                ->latest()
                ->take(5)
                ->get();

            // Products in catalog that are not yet in this shop
            $existingProductIds = $currentShop->shopProducts()->pluck('product_id');
            $availableCatalogCount = Product::where('is_active', true)
                ->whereNotIn('id', $existingProductIds)
                ->count();
        }

        $myCreatedCatalogProductsCount = Product::where('created_by', $user->id)->count();

        return Inertia::render('ShopOwner/Dashboard', [
            'shops' => $shops,
            'currentShop' => $currentShop,
            'shopStats' => $shopStats,
            'recentListings' => $recentListings,
            'availableCatalogCount' => $availableCatalogCount,
            'myCreatedCatalogProductsCount' => $myCreatedCatalogProductsCount,
        ]);
    }
}
