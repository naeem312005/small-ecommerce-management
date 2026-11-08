<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SharedCatalogController extends Controller
{
    protected function getActiveShop(Request $request): ?Shop
    {
        $user = $request->user();
        $shopId = $request->query('shop_id', session('active_shop_id'));

        /** @var Shop|null $shop */
        $shop = $user->shops()->where('id', $shopId)->first() ?? $user->shops()->first();

        if ($shop) {
            session(['active_shop_id' => $shop->id]);
        }

        return $shop;
    }

    /**
     * Browse shared catalog of products (created by admin or other shop owners).
     */
    public function index(Request $request): Response
    {
        $shop = $this->getActiveShop($request);

        $search = $request->query('search');
        $category = $request->query('category');
        $filterStatus = $request->query('filter'); // 'all', 'added', 'not_added'

        $activeShopProductIds = $shop ? $shop->shopProducts()->pluck('product_id')->toArray() : [];

        $productsQuery = Product::query()
            ->where('is_active', true)
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($category, fn ($q) => $q->where('category', $category))
            ->with('creator:id,name,role');

        if ($filterStatus === 'added') {
            $productsQuery->whereIn('id', $activeShopProductIds);
        } elseif ($filterStatus === 'not_added') {
            $productsQuery->whereNotIn('id', $activeShopProductIds);
        }

        $products = $productsQuery->latest()->paginate(12)->withQueryString();

        $categories = Product::where('is_active', true)->distinct()->pluck('category');

        return Inertia::render('ShopOwner/Catalog/Index', [
            'shop' => $shop,
            'products' => $products,
            'addedProductIds' => $activeShopProductIds,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'filter' => $filterStatus,
            ],
        ]);
    }

    /**
     * Add a master product from the shared catalog to the shop.
     */
    public function addToShop(Request $request, Product $product): RedirectResponse
    {
        $shop = $this->getActiveShop($request);

        if (! $shop) {
            return back()->with('error', 'No shop assigned to your account.');
        }

        // Check if already in shop
        $existing = ShopProduct::where('shop_id', $shop->id)->where('product_id', $product->id)->first();
        if ($existing) {
            return back()->with('error', 'Product is already listed in your shop.');
        }

        $validated = $request->validate([
            'price' => ['required', 'numeric', 'min:0'],
            'custom_title' => ['nullable', 'string', 'max:255'],
            'custom_description' => ['nullable', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'custom_thumbnail' => ['nullable', 'image', 'max:3072'],
        ]);

        $customThumbnailPath = null;
        if ($request->hasFile('custom_thumbnail')) {
            $path = $request->file('custom_thumbnail')->store('shop-products/thumbnails', 'public');
            $customThumbnailPath = '/storage/'.$path;
        }

        ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'price' => $validated['price'],
            'custom_title' => ! empty($validated['custom_title']) ? $validated['custom_title'] : null,
            'custom_description' => ! empty($validated['custom_description']) ? $validated['custom_description'] : null,
            'custom_thumbnail' => $customThumbnailPath,
            'stock' => $validated['stock'],
            'is_available' => true,
        ]);

        return redirect()->route('shop-owner.products.index')
            ->with('success', "“{$product->name}” has been added to your shop listings!");
    }
}
