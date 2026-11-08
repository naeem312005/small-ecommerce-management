<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ShopController as AdminShopController;
use App\Http\Controllers\Admin\ShopOwnerController as AdminShopOwnerController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\ShopOwner\CreateCatalogProductController;
use App\Http\Controllers\ShopOwner\SharedCatalogController;
use App\Http\Controllers\ShopOwner\ShopOwnerDashboardController;
use App\Http\Controllers\ShopOwner\ShopProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Customer Storefront Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [CustomerController::class, 'index'])->name('home');
Route::get('/shops', [CustomerController::class, 'shops'])->name('customer.shops');
Route::get('/shops/{slug}', [CustomerController::class, 'shopShow'])->name('customer.shop.show');
Route::get('/shops/{slug}/products/{productId}', [CustomerController::class, 'productShow'])->name('customer.product.show');

/*
|--------------------------------------------------------------------------
| Authenticated Dashboard Dispatcher
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isShopOwner()) {
            return redirect()->route('shop-owner.dashboard');
        }

        return redirect()->route('home');
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Admin Panel Routes (role: admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Shop Management (CRUD)
        Route::resource('shops', AdminShopController::class);

        // Product Management (CRUD - Master / Shared Catalog)
        Route::resource('products', AdminProductController::class);

        // Shop Owner Accounts Management (CRUD)
        Route::resource('shop-owners', AdminShopOwnerController::class);
    });

/*
|--------------------------------------------------------------------------
| Shop Owner Panel Routes (role: shop_owner)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:shop_owner'])
    ->prefix('shop-owner')
    ->name('shop-owner.')
    ->group(function () {
        Route::get('/dashboard', [ShopOwnerDashboardController::class, 'index'])->name('dashboard');

        // My Shop Products Management (set/modify prices, details, thumbnails, stock)
        Route::get('/products', [ShopProductController::class, 'index'])->name('products.index');
        Route::get('/products/{shopProduct}/edit', [ShopProductController::class, 'edit'])->name('products.edit');
        Route::post('/products/{shopProduct}', [ShopProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{shopProduct}', [ShopProductController::class, 'destroy'])->name('products.destroy');

        // Shared Catalog Browsing & Adding Products
        Route::get('/catalog', [SharedCatalogController::class, 'index'])->name('catalog.index');
        Route::post('/catalog/{product}/add', [SharedCatalogController::class, 'addToShop'])->name('catalog.add');

        // Create New Product for Shared Catalog (+ optional add to shop)
        Route::get('/catalog/create', [CreateCatalogProductController::class, 'create'])->name('catalog.create');
        Route::post('/catalog/store', [CreateCatalogProductController::class, 'store'])->name('catalog.store');
    });

require __DIR__.'/settings.php';
