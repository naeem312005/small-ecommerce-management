<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories with product counts.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $categories = Category::query()
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            })
            ->when($status !== null && $status !== '', function ($q) use ($status) {
                $q->where('is_active', $status === '1' || $status === 'active');
            })
            ->withCount('products')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $totalCategories = Category::count();
        $activeCategories = Category::where('is_active', true)->count();
        $totalCategorizedProducts = Product::whereNotNull('category_id')->count();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'metrics' => [
                'total' => $totalCategories,
                'active' => $activeCategories,
                'inactive' => $totalCategories - $activeCategories,
                'assignedProducts' => $totalCategorizedProducts,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Create');
    }

    /**
     * Store a newly created category.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

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

            DB::commit();

            return redirect()->route('admin.categories.index')->with('success', "Category '{$validated['name']}' created successfully.");
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin store category failed: '.$e->getMessage(), ['exception' => $e]);

            return back()->withInput()->with('error', 'Unable to create category. Please check your inputs and try again.');
        }
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
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

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

            DB::commit();

            return redirect()->route('admin.categories.index')->with('success', "Category '{$category->name}' updated successfully.");
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin update category failed: '.$e->getMessage(), ['exception' => $e, 'category_id' => $category->id]);

            return back()->withInput()->with('error', 'Unable to update category. Please try again.');
        }
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $name = $category->name;
            $productsCount = $category->products()->count();

            // Safely detach category_id from linked products so products are preserved
            Product::where('category_id', $category->id)->update(['category_id' => null]);

            $category->delete();

            DB::commit();

            $message = $productsCount > 0
                ? "Category '{$name}' deleted. {$productsCount} linked product(s) were unassigned."
                : "Category '{$name}' deleted successfully.";

            return redirect()->route('admin.categories.index')->with('success', $message);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin delete category failed: '.$e->getMessage(), ['exception' => $e, 'category_id' => $category->id]);

            return back()->with('error', 'Unable to delete category. Please try again.');
        }
    }
}
