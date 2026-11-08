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

class CreateCatalogProductController extends Controller
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
     * Show form for shop owner to create a new product for the shared catalog.
     */
    public function create(Request $request): Response
    {
        $shop = $this->getActiveShop($request);

        return Inertia::render('ShopOwner/Catalog/Create', [
            'shop' => $shop,
            'suggestedSku' => Product::generateSku(),
        ]);
    }

    /**
     * Store newly created product into the shared catalog and optionally list it in the owner's shop.
     */
    public function store(Request $request): RedirectResponse
    {
        $shop = $this->getActiveShop($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'category' => ['required', 'string', 'max:100'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:3072'],
            'add_to_my_shop' => ['boolean'],
            'shop_price' => ['nullable', 'numeric', 'min:0'],
            'shop_stock' => ['nullable', 'integer', 'min:0'],
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('products/thumbnails', 'public');
            $thumbnailPath = '/storage/'.$path;
        }

        $slug = Product::generateUniqueSlug($validated['name']);

        // 1. Create product in shared catalog (created_by = this shop owner)
        $product = Product::create([
            'created_by' => $request->user()->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'sku' => strtoupper($validated['sku']),
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

            return redirect()->route('shop-owner.products.index')
                ->with('success', "“{$product->name}” was published to the shared catalog and listed in your shop!");
        }

        return redirect()->route('shop-owner.catalog.index')
            ->with('success', "“{$product->name}” was published to the shared catalog and is now available for all shop owners!");
    }
}
