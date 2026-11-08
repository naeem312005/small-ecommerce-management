<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ShopOwnerController extends Controller
{
    /**
     * List all shop owner accounts.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $shopOwners = User::where('role', 'shop_owner')
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
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
     * Show form to create new shop owner account.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/ShopOwners/Create');
    }

    /**
     * Store new shop owner account.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => ['required', 'string', Password::default()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'shop_owner',
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.shop-owners.index')->with('success', 'Shop owner account created successfully!');
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
    public function update(Request $request, User $shopOwner): RedirectResponse
    {
        if ($shopOwner->role !== 'shop_owner') {
            abort(404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$shopOwner->id],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => ['nullable', 'string', Password::default()],
        ]);

        $shopOwner->name = $validated['name'];
        $shopOwner->email = $validated['email'];
        $shopOwner->phone = $validated['phone'] ?? null;

        if (! empty($validated['password'])) {
            $shopOwner->password = Hash::make($validated['password']);
        }

        $shopOwner->save();

        return redirect()->route('admin.shop-owners.index')->with('success', 'Shop owner updated successfully!');
    }

    /**
     * Delete shop owner account.
     */
    public function destroy(User $shopOwner): RedirectResponse
    {
        if ($shopOwner->role !== 'shop_owner') {
            abort(404);
        }

        $shopOwner->delete();

        return redirect()->route('admin.shop-owners.index')->with('success', 'Shop owner account deleted!');
    }
}
