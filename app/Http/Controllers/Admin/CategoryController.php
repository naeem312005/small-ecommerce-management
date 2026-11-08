<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of product categories.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $categories = Category::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($status !== null && $status !== '', function ($q) use ($status) {
                $q->where('is_active', $status === '1' || $status === 'active');
            })
            ->withCount('products')
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        $metrics = [
            'total' => Category::count(),
            'active' => Category::where('is_active', true)->count(),
            'productsCount' => Product::whereNotNull('category_id')->count(),
        ];

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'metrics' => $metrics,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show form to create a new category.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Create');
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name'],
            'slug' => ['nullable', 'string', 'max:120', 'unique:categories,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        $slug = ! empty($validated['slug'])
            ? Category::generateUniqueSlug($validated['slug'])
            : Category::generateUniqueSlug($validated['name']);

        Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? 'Tag',
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.categories.index')->with('success', "Category '{$validated['name']}' created successfully.");
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(Category $category): Response
    {
        $category->loadCount('products');

        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('categories', 'name')->ignore($category->id)],
            'slug' => ['nullable', 'string', 'max:120', Rule::unique('categories', 'slug')->ignore($category->id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        $slug = ! empty($validated['slug'])
            ? Category::generateUniqueSlug($validated['slug'], $category->id)
            : Category::generateUniqueSlug($validated['name'], $category->id);

        $oldName = $category->name;

        $category->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? $category->icon ?? 'Tag',
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Keep product category strings in sync if category name was updated
        if ($oldName !== $validated['name']) {
            Product::where('category_id', $category->id)
                ->orWhere('category', $oldName)
                ->update(['category' => $validated['name']]);
        }

        return redirect()->route('admin.categories.index')->with('success', "Category '{$category->name}' updated successfully.");
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        $name = $category->name;
        $productsCount = $category->products()->count();

        // Safely detach category_id from linked products so products are preserved
        Product::where('category_id', $category->id)->update(['category_id' => null]);

        $category->delete();

        $message = $productsCount > 0
            ? "Category '{$name}' deleted. {$productsCount} linked product(s) were unassigned."
            : "Category '{$name}' deleted successfully.";

        return redirect()->route('admin.categories.index')->with('success', $message);
    }
}
