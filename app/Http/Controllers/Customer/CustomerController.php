<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display public storefront showing active shops and assigned shop products.
     */
    public function index(Request $request): Response
    {
        $selectedCategory = $request->query('category');
        $selectedShopSlug = $request->query('shop');
        $search = $request->query('search');

        // Strictly query products assigned to active shops!
        $query = ShopProduct::query()
            ->where('is_available', true)
            ->whereHas('shop', function ($q) {
                $q->where('is_active', true);
            })
            ->whereHas('product', function ($q) {
                $q->where('is_active', true);
            })
            ->with(['shop:id,name,slug,logo,phone,address', 'product:id,name,sku,category,base_price,compare_at_price,thumbnail,description']);

        if ($selectedShopSlug) {
            $query->whereHas('shop', fn ($q) => $q->where('slug', $selectedShopSlug));
        }

        if ($selectedCategory) {
            $query->whereHas('product', fn ($q) => $q->where('category', $selectedCategory));
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('custom_title', 'like', "%{$search}%")
                    ->orWhere('custom_description', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%")
                            ->orWhere('category', 'like', "%{$search}%");
                    });
            });
        }

        $shopProducts = $query->latest()->paginate(12)->withQueryString();

        // Get list of active shops for filter / discovery
        $activeShops = Shop::where('is_active', true)
            ->withCount(['shopProducts' => fn ($q) => $q->where('is_available', true)])
            ->get(['id', 'name', 'slug', 'logo', 'description']);

        // Distinct categories available in active shop products
        $categories = Product::whereHas('shopProducts', function ($q) {
            $q->where('is_available', true)->whereHas('shop', fn ($sq) => $sq->where('is_active', true));
        })
            ->distinct()
            ->pluck('category');

        return Inertia::render('Customer/Home', [
            'shopProducts' => $shopProducts,
            'activeShops' => $activeShops,
            'categories' => $categories,
            'filters' => [
                'category' => $selectedCategory,
                'shop' => $selectedShopSlug,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display directory of all active shops.
     */
    public function shops(Request $request): Response
    {
        $search = $request->query('search');

        $shops = Shop::where('is_active', true)
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            })
            ->withCount(['shopProducts' => fn ($q) => $q->where('is_available', true)])
            ->with('owner:id,name,email')
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Customer/Shops', [
            'shops' => $shops,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display dedicated storefront for a specific shop.
     * Customers only see products assigned to this shop!
     */
    public function shopShow(Request $request, string $slug): Response
    {
        $shop = Shop::where('slug', $slug)
            ->where('is_active', true)
            ->with('owner:id,name,email,phone')
            ->firstOrFail();

        $selectedCategory = $request->query('category');
        $search = $request->query('search');

        $productsQuery = $shop->shopProducts()
            ->where('is_available', true)
            ->whereHas('product', fn ($q) => $q->where('is_active', true))
            ->with('product:id,name,sku,category,base_price,compare_at_price,thumbnail,description');

        if ($selectedCategory) {
            $productsQuery->whereHas('product', fn ($q) => $q->where('category', $selectedCategory));
        }

        if ($search) {
            $productsQuery->where(function ($q) use ($search) {
                $q->where('custom_title', 'like', "%{$search}%")
                    ->orWhere('custom_description', 'like', "%{$search}%")
                    ->orWhereHas('product', fn ($pq) => $pq->where('name', 'like', "%{$search}%"));
            });
        }

        $shopProducts = $productsQuery->latest()->paginate(12)->withQueryString();

        $categories = Product::whereHas('shopProducts', function ($q) use ($shop) {
            $q->where('shop_id', $shop->id)->where('is_available', true);
        })
            ->distinct()
            ->pluck('category');

        return Inertia::render('Customer/ShopShow', [
            'shop' => $shop,
            'shopProducts' => $shopProducts,
            'categories' => $categories,
            'filters' => [
                'category' => $selectedCategory,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display a specific assigned product within a specific shop.
     */
    public function productShow(string $shopSlug, int $shopProductId): Response
    {
        $shop = Shop::where('slug', $shopSlug)
            ->where('is_active', true)
            ->firstOrFail();

        // Must be assigned to this specific shop!
        $shopProduct = ShopProduct::where('shop_id', $shop->id)
            ->where('id', $shopProductId)
            ->where('is_available', true)
            ->whereHas('product', fn ($q) => $q->where('is_active', true))
            ->with(['shop', 'product.creator:id,name'])
            ->firstOrFail();

        // Related items from this same shop
        $relatedProducts = ShopProduct::where('shop_id', $shop->id)
            ->where('id', '!=', $shopProduct->id)
            ->where('is_available', true)
            ->whereHas('product', fn ($q) => $q->where('is_active', true))
            ->with(['product:id,name,category,base_price,compare_at_price,thumbnail'])
            ->inRandomOrder()
            ->take(4)
            ->get();

        return Inertia::render('Customer/ProductShow', [
            'shop' => $shop,
            'shopProduct' => $shopProduct,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Display shopping bag page.
     */
    public function cart(): Response
    {
        return Inertia::render('Customer/Cart');
    }

    /**
     * Display checkout page.
     */
    public function checkout(): Response
    {
        return Inertia::render('Customer/Checkout');
    }
}
