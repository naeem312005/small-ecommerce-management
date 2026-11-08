import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    Filter,
    Layers,
    Package,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Store,
    Tag,
} from 'lucide-react';
import React, { useState } from 'react';
import CustomerLayout from '@/layouts/customer-layout';
import type { PaginatedData, Shop, ShopProduct } from '@/types';

type Props = {
    shopProducts: PaginatedData<ShopProduct>;
    activeShops: Shop[];
    categories: string[];
    filters: {
        category?: string;
        shop?: string;
        search?: string;
    };
};

export default function CustomerHome({
    shopProducts,
    activeShops,
    categories,
    filters,
}: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/',
            {
                ...filters,
                search: searchTerm,
            },
            { preserveState: true }
        );
    };

    const handleFilterShop = (shopSlug: string | null) => {
        router.get(
            '/',
            {
                ...filters,
                shop: shopSlug || undefined,
            },
            { preserveState: true }
        );
    };

    const handleFilterCategory = (category: string | null) => {
        router.get(
            '/',
            {
                ...filters,
                category: category || undefined,
            },
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        router.get('/');
    };

    const hasActiveFilters = Boolean(filters.category || filters.shop || filters.search);

    return (
        <CustomerLayout>
            <Head title="Small E-commerce Management - Shared Catalog Platform" />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 px-4 py-16 text-white sm:px-6 lg:px-8">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative mx-auto max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Shared Master Catalog • Shop-Specific Customizations</span>
                    </div>

                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Shop Curated Collections Across Independent Stores
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                        Browse active shops and their uniquely priced, customized product offerings powered by a central shared catalog.
                    </p>

                    {/* Quick Search */}
                    <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-xl">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search assigned products by title, category, or description..."
                                className="w-full rounded-2xl border-0 bg-white/10 py-3.5 pl-12 pr-28 text-sm text-white placeholder-slate-400 backdrop-blur-md ring-1 ring-white/20 focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-indigo-500"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Notice Bar: Functional Isolation Verification */}
            <div className="border-y border-amber-200 bg-amber-50/90 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/40">
                <div className="mx-auto flex max-w-7xl items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                        <span className="font-bold">Catalog Isolation Enforced:</span> Customers only see products assigned to active shops with their shop-specific prices, thumbnails, and descriptions. Master products that have not been assigned to any shop (e.g. <em>PRD-UNASSIGNED-01</em> and <em>PRD-UNASSIGNED-02</em>) are strictly hidden from this storefront view.
                    </div>
                </div>
            </div>

            {/* Featured Active Shops Carousel/Cards */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Active Stores on the Platform
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Each store selects products from the shared catalog and applies custom prices and details.
                        </p>
                    </div>
                    <Link
                        href="/shops"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                        <span>View all shops</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {activeShops.map((shop) => (
                        <div
                            key={shop.id}
                            className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition ${
                                filters.shop === shop.slug
                                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/20'
                                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900'
                            }`}
                        >
                            <div>
                                <div className="flex items-center gap-3.5">
                                    {shop.logo ? (
                                        <img
                                            src={shop.logo}
                                            alt={shop.name}
                                            className="h-12 w-12 rounded-xl object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                            <Store className="h-6 w-6" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                            {shop.name}
                                        </h3>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3 w-3" />
                                            {shop.shop_products_count ?? 0} Listed Products
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-3 text-xs line-clamp-2 text-slate-600 dark:text-slate-400">
                                    {shop.description || 'Welcome to our shop storefront.'}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => handleFilterShop(filters.shop === shop.slug ? null : shop.slug)}
                                    className={`text-xs font-semibold ${
                                        filters.shop === shop.slug
                                            ? 'text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {filters.shop === shop.slug ? '✓ Showing this shop' : 'Filter by this shop'}
                                </button>
                                <Link
                                    href={`/shops/${shop.slug}`}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-500"
                                >
                                    <span>Visit Shop</span>
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Filter Bar & Products Grid */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Filters */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                            <Filter className="h-3.5 w-3.5" /> Filter Category:
                        </span>
                        <button
                            type="button"
                            onClick={() => handleFilterCategory(null)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                !filters.category
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleFilterCategory(filters.category === cat ? null : cat)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                    filters.category === cat
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-500 self-start sm:self-auto"
                        >
                            Reset all filters
                        </button>
                    )}
                </div>

                {/* Active filter badges */}
                {hasActiveFilters && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-500">Active filters:</span>
                        {filters.shop && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                Store: {filters.shop}
                                <button type="button" onClick={() => handleFilterShop(null)}>×</button>
                            </span>
                        )}
                        {filters.category && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                Category: {filters.category}
                                <button type="button" onClick={() => handleFilterCategory(null)}>×</button>
                            </span>
                        )}
                        {filters.search && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                Search: "{filters.search}"
                            </span>
                        )}
                    </div>
                )}

                {/* Product Listings Grid */}
                <div className="mt-8">
                    {shopProducts.data.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                            <Package className="mx-auto h-12 w-12 text-slate-400" />
                            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                                No assigned products found
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                No shop products matched your current filters. Remember only products assigned to active shops appear here.
                            </p>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {shopProducts.data.map((item) => {
                                const title = item.display_title || item.product?.name || 'Untitled';
                                const thumbnail = item.display_thumbnail || item.product?.thumbnail;
                                const description = item.display_description || item.product?.description;
                                const shop = item.shop;

                                return (
                                    <div
                                        key={item.id}
                                        className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            {thumbnail ? (
                                                <img
                                                    src={thumbnail}
                                                    alt={title}
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                    <Package className="h-12 w-12" />
                                                </div>
                                            )}

                                            {/* Category Tag */}
                                            {item.product?.category && (
                                                <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold text-slate-800 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-200">
                                                    {item.product.category}
                                                </span>
                                            )}

                                            {/* Custom thumbnail badge if overridden */}
                                            {item.custom_thumbnail && (
                                                <span className="absolute top-3 right-3 rounded-md bg-indigo-600/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
                                                    Shop Custom Image
                                                </span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col p-4">
                                            {/* Shop Link Header */}
                                            {shop && (
                                                <Link
                                                    href={`/shops/${shop.slug}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                                >
                                                    <Store className="h-3 w-3" />
                                                    <span>{shop.name}</span>
                                                </Link>
                                            )}

                                            <h3 className="mt-1.5 text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                {title}
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500 line-clamp-2 flex-1">
                                                {description}
                                            </p>

                                            {/* Pricing & Stock */}
                                            <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                                                <div>
                                                    <span className="block text-[10px] uppercase font-semibold text-slate-400">
                                                        Shop Price
                                                    </span>
                                                    <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                                                        ${Number(item.price).toFixed(2)}
                                                    </span>
                                                    {item.product && Number(item.price) !== Number(item.product.base_price) && (
                                                        <span className="ml-1.5 text-xs line-through text-slate-400">
                                                            ${Number(item.product.base_price).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="text-[11px] font-medium text-slate-500">
                                                    {item.stock > 0 ? (
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                                            {item.stock} in stock
                                                        </span>
                                                    ) : (
                                                        <span className="text-rose-500 font-semibold">Out of stock</span>
                                                    )}
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            {shop && (
                                                <Link
                                                    href={`/shops/${shop.slug}/products/${item.id}`}
                                                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span>View Product Details</span>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {shopProducts.links && shopProducts.links.length > 3 && (
                        <div className="mt-10 flex items-center justify-center gap-1">
                            {shopProducts.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : !link.url
                                              ? 'cursor-not-allowed text-slate-400'
                                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </CustomerLayout>
    );
}
