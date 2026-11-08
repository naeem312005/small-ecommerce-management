<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopOwner\AddProductToShopRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class SharedCatalogController extends Controller
{
    /**
     * Helper to get the active shop of the authenticated shop owner.
     */
    protected function getActiveShop(Request $request): ?Shop
    {
        return $request->user()->shops()->where('is_active', true)->first()
            ?? $request->user()->shops()->first();
    }

    /**
     * Display shared product catalog for shop owners.
     */
    public function index(Request $request): Response
    {
        $shop = $this->getActiveShop($request);
        $search = $request->query('search');
        $category = $request->query('category');
        $filterStatus = $request->query('filter'); // 'all', 'added', 'not_added'

        $addedProductIds = $shop
            ? ShopProduct::where('shop_id', $shop->id)->pluck('product_id')->toArray()
            : [];

        $products = Product::query()
            ->where('is_active', true)
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($category, fn ($q) => $q->where('category', $category))
            ->when($filterStatus === 'added', fn ($q) => $q->whereIn('id', $addedProductIds))
            ->when($filterStatus === 'not_added', fn ($q) => $q->whereNotIn('id', $addedProductIds))
            ->with('creator:id,name,role')
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = Category::where('is_active', true)->orderBy('name')->pluck('name')->values()->all();
        if (empty($categories)) {
            $categories = Product::distinct()->pluck('category')->values()->all();
        }

        return Inertia::render('ShopOwner/Catalog/Index', [
            'products' => $products,
            'addedProductIds' => $addedProductIds,
            'categories' => $categories,
            'shop' => $shop,
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
    public function addToShop(AddProductToShopRequest $request, Product $product): RedirectResponse
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

        $validated = $request->validated();

        try {
            DB::beginTransaction();

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

            DB::commit();

            return redirect()->route('shop-owner.products.index')
                ->with('success', "“{$product->name}” has been added to your shop listings!");
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('ShopOwner addToShop failed: '.$e->getMessage(), ['exception' => $e, 'product_id' => $product->id]);

            return back()->withInput()->with('error', 'Unable to add product to your shop. Please try again.');
        }
    }
}
