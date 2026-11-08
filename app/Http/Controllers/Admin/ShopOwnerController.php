<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShopOwnerRequest;
use App\Http\Requests\Admin\UpdateShopOwnerRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ShopOwnerController extends Controller
{
    /**
     * Display listing of all shop owner accounts.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $shopOwners = User::where('role', 'shop_owner')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->with(['shops:id,user_id,name,slug,is_active'])
            ->withCount('shops')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/ShopOwners/Index', [
            'shopOwners' => $shopOwners,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show form to create a new shop owner account.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/ShopOwners/Create');
    }

    /**
     * Store newly created shop owner account.
     */
    public function store(StoreShopOwnerRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'role' => 'shop_owner',
                'email_verified_at' => now(),
            ]);

            DB::commit();

            return redirect()->route('admin.shop-owners.index')->with('success', 'Shop owner account created successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin store shop owner failed: '.$e->getMessage(), ['exception' => $e]);

            return back()->withInput()->with('error', 'Unable to create shop owner account. Please check your inputs and try again.');
        }
    }

    /**
     * Show form to edit shop owner account.
     */
    public function edit(User $shopOwner): Response
    {
        if ($shopOwner->role !== 'shop_owner') {
            abort(404);
        }

        return Inertia::render('Admin/ShopOwners/Edit', [
            'shopOwner' => $shopOwner->load('shops:id,user_id,name,slug,is_active'),
        ]);
    }

    /**
     * Update shop owner account.
     */
    public function update(UpdateShopOwnerRequest $request, User $shopOwner): RedirectResponse
    {
        if ($shopOwner->role !== 'shop_owner') {
            abort(404);
        }

        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $shopOwner->name = $validated['name'];
            $shopOwner->email = $validated['email'];
            $shopOwner->phone = $validated['phone'] ?? null;

            if (! empty($validated['password'])) {
                $shopOwner->password = Hash::make($validated['password']);
            }

            $shopOwner->save();

            DB::commit();

            return redirect()->route('admin.shop-owners.index')->with('success', 'Shop owner updated successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin update shop owner failed: '.$e->getMessage(), ['exception' => $e, 'shop_owner_id' => $shopOwner->id]);

            return back()->withInput()->with('error', 'Unable to update shop owner account. Please try again.');
        }
    }

    /**
     * Delete shop owner account.
     */
    public function destroy(User $shopOwner): RedirectResponse
    {
        if ($shopOwner->role !== 'shop_owner') {
            abort(404);
        }

        try {
            DB::beginTransaction();

            $shopOwner->delete();

            DB::commit();

            return redirect()->route('admin.shop-owners.index')->with('success', 'Shop owner account deleted!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin delete shop owner failed: '.$e->getMessage(), ['exception' => $e, 'shop_owner_id' => $shopOwner->id]);

            return back()->with('error', 'Unable to delete shop owner account. Please try again.');
        }
    }
}
