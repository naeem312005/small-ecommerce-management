<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopOwner\UpdateShopProductRequest;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ShopProductController extends Controller
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
     * Display listing of products currently assigned to this shop.
     */
    public function index(Request $request): Response
    {
        $shop = $this->getActiveShop($request);

        if (! $shop) {
            return Inertia::render('ShopOwner/Products/NoShop');
        }

        $search = $request->query('search');
        $status = $request->query('status');

        $shopProducts = ShopProduct::where('shop_id', $shop->id)
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('custom_title', 'like', "%{$search}%")
                        ->orWhere('custom_description', 'like', "%{$search}%")
                        ->orWhereHas('product', function ($pq) use ($search) {
                            $pq->where('name', 'like', "%{$search}%")
                                ->orWhere('sku', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== null && $status !== '', function ($q) use ($status) {
                $q->where('is_available', $status === '1' || $status === 'active');
            })
            ->with(['product:id,name,sku,category,base_price,compare_at_price,thumbnail,description,creator_id', 'product.creator:id,name,role'])
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
    public function update(UpdateShopProductRequest $request, ShopProduct $shopProduct): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

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
            $shopProduct->compare_at_price = isset($validated['compare_at_price']) && $validated['compare_at_price'] !== ''
                ? $validated['compare_at_price']
                : null;
            $shopProduct->custom_title = ! empty($validated['custom_title']) ? $validated['custom_title'] : null;
            $shopProduct->custom_description = ! empty($validated['custom_description']) ? $validated['custom_description'] : null;
            $shopProduct->stock = $validated['stock'];
            $shopProduct->is_available = $validated['is_available'] ?? $shopProduct->is_available;
            $shopProduct->save();

            DB::commit();

            return redirect()->route('shop-owner.products.index')->with('success', 'Shop product listing updated successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('ShopProduct update failed: '.$e->getMessage(), ['exception' => $e, 'shop_product_id' => $shopProduct->id]);

            return back()->withInput()->with('error', 'Unable to update shop product. Please check your inputs and try again.');
        }
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

        try {
            DB::beginTransaction();

            if ($shopProduct->custom_thumbnail && str_starts_with($shopProduct->custom_thumbnail, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $shopProduct->custom_thumbnail));
            }

            $shopProduct->delete();

            DB::commit();

            return redirect()->route('shop-owner.products.index')->with('success', 'Product removed from your shop.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('ShopProduct delete failed: '.$e->getMessage(), ['exception' => $e, 'shop_product_id' => $shopProduct->id]);

            return back()->with('error', 'Unable to remove product from shop. Please try again.');
        }
    }
}
