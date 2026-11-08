<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'banner' => ['nullable', 'image', 'max:3072'],
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('shops/logos', 'public');
            $logoPath = '/storage/'.$logoPath;
        }

        $bannerPath = null;
        if ($request->hasFile('banner')) {
            $bannerPath = $request->file('banner')->store('shops/banners', 'public');
            $bannerPath = '/storage/'.$bannerPath;
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

        return redirect()->route('admin.shops.index')->with('success', 'Shop created successfully!');
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
    public function update(Request $request, Shop $shop): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'banner' => ['nullable', 'image', 'max:3072'],
        ]);

        if ($request->hasFile('logo')) {
            if ($shop->logo && str_starts_with($shop->logo, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $shop->logo));
            }
            $logoPath = $request->file('logo')->store('shops/logos', 'public');
            $shop->logo = '/storage/'.$logoPath;
        }

        if ($request->hasFile('banner')) {
            if ($shop->banner && str_starts_with($shop->banner, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $shop->banner));
            }
            $bannerPath = $request->file('banner')->store('shops/banners', 'public');
            $shop->banner = '/storage/'.$bannerPath;
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

        return redirect()->route('admin.shops.index')->with('success', 'Shop updated successfully!');
    }

    /**
     * Remove the specified shop.
     */
    public function destroy(Shop $shop): RedirectResponse
    {
        if ($shop->logo && str_starts_with($shop->logo, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $shop->logo));
        }
        if ($shop->banner && str_starts_with($shop->banner, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $shop->banner));
        }

        $shop->delete();

        return redirect()->route('admin.shops.index')->with('success', 'Shop deleted successfully!');
    }
}
