<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShopRequest;
use App\Http\Requests\Admin\UpdateShopRequest;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    /**
     * Display a listing of all shops.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $shops = Shop::query()
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('owner', fn ($oq) => $oq->where('name', 'like', "%{$search}%"));
            })
            ->when($status !== null && $status !== '', function ($q) use ($status) {
                $q->where('is_active', $status === '1' || $status === 'active');
            })
            ->with('owner:id,name,email,phone')
            ->withCount('shopProducts')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Shops/Index', [
            'shops' => $shops,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show form to create a new shop.
     */
    public function create(): Response
    {
        $shopOwners = User::where('role', 'shop_owner')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Shops/Create', [
            'shopOwners' => $shopOwners,
        ]);
    }

    /**
     * Store a newly created shop.
     */
    public function store(StoreShopRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $logoPath = null;
            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('shops/logos', 'public');
                $logoPath = '/storage/'.$path;
            }

            $bannerPath = null;
            if ($request->hasFile('banner')) {
                $path = $request->file('banner')->store('shops/banners', 'public');
                $bannerPath = '/storage/'.$path;
            }

            $slug = Shop::generateUniqueSlug($validated['name']);

            Shop::create([
                'user_id' => $validated['user_id'],
                'name' => $validated['name'],
                'slug' => $slug,
                'description' => $validated['description'] ?? null,
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'logo' => $logoPath,
                'banner' => $bannerPath,
            ]);

            DB::commit();

            return redirect()->route('admin.shops.index')->with('success', 'Shop created successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin store shop failed: '.$e->getMessage(), ['exception' => $e]);

            return back()->withInput()->with('error', 'Unable to create shop. Please check your inputs and try again.');
        }
    }

    /**
     * Show form to edit an existing shop.
     */
    public function edit(Shop $shop): Response
    {
        $shopOwners = User::where('role', 'shop_owner')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Shops/Edit', [
            'shop' => $shop->load('owner:id,name,email'),
            'shopOwners' => $shopOwners,
        ]);
    }

    /**
     * Update the specified shop.
     */
    public function update(UpdateShopRequest $request, Shop $shop): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            if ($request->hasFile('logo')) {
                if ($shop->logo && str_starts_with($shop->logo, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $shop->logo));
                }
                $path = $request->file('logo')->store('shops/logos', 'public');
                $shop->logo = '/storage/'.$path;
            }

            if ($request->hasFile('banner')) {
                if ($shop->banner && str_starts_with($shop->banner, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $shop->banner));
                }
                $path = $request->file('banner')->store('shops/banners', 'public');
                $shop->banner = '/storage/'.$path;
            }

            if ($shop->name !== $validated['name']) {
                $shop->slug = Shop::generateUniqueSlug($validated['name'], $shop->id);
            }

            $shop->user_id = $validated['user_id'];
            $shop->name = $validated['name'];
            $shop->description = $validated['description'] ?? null;
            $shop->email = $validated['email'] ?? null;
            $shop->phone = $validated['phone'] ?? null;
            $shop->address = $validated['address'] ?? null;
            $shop->is_active = $validated['is_active'] ?? $shop->is_active;
            $shop->save();

            DB::commit();

            return redirect()->route('admin.shops.index')->with('success', 'Shop updated successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin update shop failed: '.$e->getMessage(), ['exception' => $e, 'shop_id' => $shop->id]);

            return back()->withInput()->with('error', 'Unable to update shop. Please try again.');
        }
    }

    /**
     * Remove the specified shop.
     */
    public function destroy(Shop $shop): RedirectResponse
    {
        try {
            DB::beginTransaction();

            if ($shop->logo && str_starts_with($shop->logo, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $shop->logo));
            }
            if ($shop->banner && str_starts_with($shop->banner, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $shop->banner));
            }

            $shop->delete();

            DB::commit();

            return redirect()->route('admin.shops.index')->with('success', 'Shop deleted successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin delete shop failed: '.$e->getMessage(), ['exception' => $e, 'shop_id' => $shop->id]);

            return back()->with('error', 'Unable to delete shop. Please try again.');
        }
    }
}
