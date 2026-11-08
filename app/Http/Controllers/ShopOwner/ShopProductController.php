<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ShopProductController extends Controller
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
     * List products currently listed in the shop owner's shop.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $shop = $this->getActiveShop($request);

        if (! $shop) {
            return Inertia::render('ShopOwner/Products/NoShop', [
                'message' => 'You do not have an active shop yet. Please contact an administrator to assign a shop to your account.',
            ]);
        }

        $search = $request->query('search');
        $status = $request->query('status');

        $shopProducts = $shop->shopProducts()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('custom_title', 'like', "%{$search}%")
                        ->orWhere('custom_description', 'like', "%{$search}%")
                        ->orWhereHas('product', function ($pq) use ($search) {
                            $pq->where('name', 'like', "%{$search}%")
                                ->orWhere('sku', 'like', "%{$search}%")
                                ->orWhere('category', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== null && $status !== '', function ($q) use ($status) {
                $q->where('is_available', $status === '1' || $status === 'active');
            })
            ->with('product:id,name,sku,category,base_price,thumbnail,description')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('ShopOwner/Products/Index', [
            'shop' => $shop,
            'shopProducts' => $shopProducts,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show form to edit shop-specific product details, price, and thumbnail.
     */
    public function edit(Request $request, ShopProduct $shopProduct): Response
    {
        // Ensure this shop product belongs to one of the user's shops
        $userShops = $request->user()->shops()->pluck('id')->toArray();
        if (! in_array($shopProduct->shop_id, $userShops, true)) {
            abort(403, 'Unauthorized access to this shop product.');
        }

        return Inertia::render('ShopOwner/Products/Edit', [
            'shopProduct' => $shopProduct->load(['shop', 'product']),
        ]);
    }

    /**
     * Update shop-specific product details, price, thumbnail, stock, and availability.
     */
    public function update(Request $request, ShopProduct $shopProduct): RedirectResponse
    {
        $userShops = $request->user()->shops()->pluck('id')->toArray();
        if (! in_array($shopProduct->shop_id, $userShops, true)) {
            abort(403, 'Unauthorized access to this shop product.');
        }

        $validated = $request->validate([
            'price' => ['required', 'numeric', 'min:0'],
            'custom_title' => ['nullable', 'string', 'max:255'],
            'custom_description' => ['nullable', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_available' => ['boolean'],
            'custom_thumbnail' => ['nullable', 'image', 'max:3072'],
            'remove_custom_thumbnail' => ['nullable', 'boolean'],
        ]);

        if (! empty($validated['remove_custom_thumbnail']) && $shopProduct->custom_thumbnail) {
            if (str_starts_with($shopProduct->custom_thumbnail, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $shopProduct->custom_thumbnail));
            }
            $shopProduct->custom_thumbnail = null;
        }

        if ($request->hasFile('custom_thumbnail')) {
            if ($shopProduct->custom_thumbnail && str_starts_with($shopProduct->custom_thumbnail, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $shopProduct->custom_thumbnail));
            }
            $path = $request->file('custom_thumbnail')->store('shop-products/thumbnails', 'public');
            $shopProduct->custom_thumbnail = '/storage/'.$path;
        }

        $shopProduct->price = $validated['price'];
        $shopProduct->custom_title = ! empty($validated['custom_title']) ? $validated['custom_title'] : null;
        $shopProduct->custom_description = ! empty($validated['custom_description']) ? $validated['custom_description'] : null;
        $shopProduct->stock = $validated['stock'];
        $shopProduct->is_available = $validated['is_available'] ?? $shopProduct->is_available;
        $shopProduct->save();

        return redirect()->route('shop-owner.products.index')->with('success', 'Shop product listing updated successfully!');
    }

    /**
     * Remove the product from this shop's catalog.
     * Note: Does NOT delete the master product from the shared catalog!
     */
    public function destroy(Request $request, ShopProduct $shopProduct): RedirectResponse
    {
        $userShops = $request->user()->shops()->pluck('id')->toArray();
        if (! in_array($shopProduct->shop_id, $userShops, true)) {
            abort(403, 'Unauthorized access to this shop product.');
        }

        if ($shopProduct->custom_thumbnail && str_starts_with($shopProduct->custom_thumbnail, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $shopProduct->custom_thumbnail));
        }

        $shopProduct->delete();

        return redirect()->route('shop-owner.products.index')->with('success', 'Product removed from your shop.');
    }
}
