<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display listing of master products in shared catalog.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $category = $request->query('category');
        $status = $request->query('status');

        $products = Product::query()
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('creator', fn ($cq) => $cq->where('name', 'like', "%{$search}%"));
            })
            ->when($category, fn ($q) => $q->where('category', $category))
            ->when($status !== null && $status !== '', function ($q) use ($status) {
                $q->where('is_active', $status === '1' || $status === 'active');
            })
            ->with('creator:id,name,role')
            ->withCount('shopProducts')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $categories = Category::where('is_active', true)->orderBy('name')->pluck('name')->values()->all();
        if (empty($categories)) {
            $categories = Product::distinct()->pluck('category')->values()->all();
        }

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show form to create a new catalog product.
     */
    public function create(): Response
    {
        $categories = Category::where('is_active', true)->orderBy('name')->pluck('name')->values()->all();

        return Inertia::render('Admin/Products/Create', [
            'suggestedSku' => Product::generateSku(),
            'categories' => $categories,
        ]);
    }

    /**
     * Store newly created product in master catalog.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
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

            Product::create([
                'created_by' => (int) $request->user()->id,
                'name' => $validated['name'],
                'slug' => $slug,
                'sku' => strtoupper($validated['sku']),
                'category_id' => $categoryModel?->id,
                'category' => $validated['category'],
                'base_price' => $validated['base_price'],
                'compare_at_price' => isset($validated['compare_at_price']) && $validated['compare_at_price'] !== ''
                    ? $validated['compare_at_price']
                    : null,
                'description' => $validated['description'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'thumbnail' => $thumbnailPath,
            ]);

            DB::commit();

            return redirect()->route('admin.products.index')->with('success', 'Product added to shared catalog successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin store product failed: '.$e->getMessage(), ['exception' => $e]);

            return back()->withInput()->with('error', 'Unable to create product. Please check your inputs and try again.');
        }
    }

    /**
     * Show form to edit master product.
     */
    public function edit(Product $product): Response
    {
        $categories = Category::where('is_active', true)->orderBy('name')->pluck('name')->values()->all();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load('creator:id,name,role'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update master product.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            if ($request->hasFile('thumbnail')) {
                if ($product->thumbnail && str_starts_with($product->thumbnail, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $product->thumbnail));
                }
                $path = $request->file('thumbnail')->store('products/thumbnails', 'public');
                $product->thumbnail = '/storage/'.$path;
            }

            if ($product->name !== $validated['name']) {
                $product->slug = Product::generateUniqueSlug($validated['name'], $product->id);
            }

            $categoryModel = Category::where('name', $validated['category'])->first();

            $product->name = $validated['name'];
            $product->sku = strtoupper($validated['sku']);
            $product->category_id = $categoryModel?->id;
            $product->category = $validated['category'];
            $product->base_price = $validated['base_price'];
            $product->compare_at_price = isset($validated['compare_at_price']) && $validated['compare_at_price'] !== ''
                ? $validated['compare_at_price']
                : null;
            $product->description = $validated['description'] ?? null;
            $product->is_active = $validated['is_active'] ?? $product->is_active;
            $product->save();

            DB::commit();

            return redirect()->route('admin.products.index')->with('success', 'Catalog product updated successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin update product failed: '.$e->getMessage(), ['exception' => $e, 'product_id' => $product->id]);

            return back()->withInput()->with('error', 'Unable to update product. Please try again.');
        }
    }

    /**
     * Delete product from shared catalog.
     */
    public function destroy(Product $product): RedirectResponse
    {
        try {
            DB::beginTransaction();

            if ($product->thumbnail && str_starts_with($product->thumbnail, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $product->thumbnail));
            }

            $product->delete();

            DB::commit();

            return redirect()->route('admin.products.index')->with('success', 'Product removed from catalog!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin delete product failed: '.$e->getMessage(), ['exception' => $e, 'product_id' => $product->id]);

            return back()->with('error', 'Unable to delete product. Please try again.');
        }
    }
}
