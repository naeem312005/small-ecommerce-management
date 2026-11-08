<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopOwner\StoreCatalogProductRequest;
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

class CreateCatalogProductController extends Controller
{
    /**
     * Helper to get active shop.
     */
    protected function getActiveShop(Request $request): ?Shop
    {
        return $request->user()->shops()->where('is_active', true)->first()
            ?? $request->user()->shops()->first();
    }

    /**
     * Show form for shop owner to create a new product for the shared catalog.
     */
    public function create(Request $request): Response
    {
        $shop = $this->getActiveShop($request);
        $categories = Category::where('is_active', true)->orderBy('name')->pluck('name')->values()->all();

        return Inertia::render('ShopOwner/Catalog/Create', [
            'shop' => $shop,
            'suggestedSku' => Product::generateSku(),
            'categories' => $categories,
        ]);
    }

    /**
     * Store newly created product into the shared catalog and optionally list it in the owner's shop.
     */
    public function store(StoreCatalogProductRequest $request): RedirectResponse
    {
        $shop = $this->getActiveShop($request);
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $thumbnailPath = null;
            if ($request->hasFile('thumbnail')) {
                $path = $request->file('thumbnail')->store('products/thumbnails', 'public');
                $thumbnailPath = '/storage/'.$path;
            }

            $slug = Product::generateUniqueSlug($validated['name']);
            $categoryModel = Category::where('name', $validated['category'])->first();

            // 1. Create product in shared catalog (created_by = this shop owner)
            $product = Product::create([
                'created_by' => (int) $request->user()->id,
                'name' => $validated['name'],
                'slug' => $slug,
                'sku' => strtoupper($validated['sku']),
                'category_id' => $categoryModel?->id,
                'category' => $validated['category'],
                'base_price' => $validated['base_price'],
                'description' => $validated['description'] ?? null,
                'thumbnail' => $thumbnailPath,
                'is_active' => true,
            ]);

            // 2. If requested and shop exists, automatically list in owner's shop
            if (! empty($validated['add_to_my_shop']) && $shop) {
                $shopPrice = ! empty($validated['shop_price']) ? $validated['shop_price'] : $validated['base_price'];
                $stock = isset($validated['shop_stock']) ? (int) $validated['shop_stock'] : 50;

                ShopProduct::create([
                    'shop_id' => $shop->id,
                    'product_id' => $product->id,
                    'price' => $shopPrice,
                    'custom_title' => null,
                    'custom_description' => null,
                    'custom_thumbnail' => null,
                    'stock' => $stock,
                    'is_available' => true,
                ]);

                DB::commit();

                return redirect()->route('shop-owner.products.index')
                    ->with('success', "“{$product->name}” has been published to the shared catalog and added to your shop listings!");
            }

            DB::commit();

            return redirect()->route('shop-owner.catalog.index')
                ->with('success', "“{$product->name}” has been published to the shared product catalog!");
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('ShopOwner store catalog product failed: '.$e->getMessage(), ['exception' => $e]);

            return back()->withInput()->with('error', 'Unable to contribute product to catalog. Please check your inputs and try again.');
        }
    }
}
