<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'category' => ['required', 'string', 'max:100'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'thumbnail' => ['nullable', 'image', 'max:3072'],
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('products/thumbnails', 'public');
            $thumbnailPath = '/storage/'.$path;
        }

        $slug = Product::generateUniqueSlug($validated['name']);
        $categoryModel = Category::where('name', $validated['category'])->first();

        Product::create([
            'created_by' => $request->user()->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'sku' => strtoupper($validated['sku']),
            'category_id' => $categoryModel?->id,
            'category' => $validated['category'],
            'base_price' => $validated['base_price'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'thumbnail' => $thumbnailPath,
        ]);

        return redirect()->route('admin.products.index')->with('success', 'Product added to shared catalog successfully!');
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
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku,'.$product->id],
            'category' => ['required', 'string', 'max:100'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'thumbnail' => ['nullable', 'image', 'max:3072'],
        ]);

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
        $product->description = $validated['description'] ?? null;
        $product->is_active = $validated['is_active'] ?? $product->is_active;
        $product->save();

        return redirect()->route('admin.products.index')->with('success', 'Catalog product updated successfully!');
    }

    /**
     * Delete product from shared catalog.
     */
    public function destroy(Product $product): RedirectResponse
    {
        if ($product->thumbnail && str_starts_with($product->thumbnail, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $product->thumbnail));
        }

        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product removed from catalog!');
    }
}
