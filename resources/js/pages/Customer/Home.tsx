import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    Eye,
    Filter,
    Heart,
    Package,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Store,
    Tag,
    Truck,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';
import CustomerLayout from '@/layouts/customer-layout';
import { notify } from '@/lib/alert';
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
    const { addItem } = useCart();
    const [addedId, setAddedId] = useState<number | null>(null);

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

    const handleAddToCart = (e: React.MouseEvent, sp: ShopProduct) => {
        e.preventDefault();
        e.stopPropagation();

        const title = sp.display_title || sp.product?.name || 'Untitled';
        const thumb = sp.display_thumbnail || sp.product?.thumbnail;

        addItem({
            id: sp.id,
            shopId: sp.shop?.id || 0,
            shopName: sp.shop?.name || 'Boutique',
            shopSlug: sp.shop?.slug || '',
            title,
            price: Number(sp.price),
            thumbnail: thumb,
            stock: sp.stock,
            quantity: 1,
        });

        notify.success(`Added to bag!`, `${title} (${sp.shop?.name})`);

        setAddedId(sp.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    const hasActiveFilters = Boolean(filters.category || filters.shop || filters.search);

    return (
        <CustomerLayout>
            <Head title="Velora Market — Curated Goods From Independent Boutiques" />

            {/* Editorial Hero Section */}
            <div className="relative overflow-hidden bg-slate-950 text-white">
                {/* Background glow and subtle grid */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px]" />

                <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
                    {/* Pill Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-300 backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                        <span>SPRING / SUMMER 2026 EDITORIAL</span>
                    </div>

                    {/* Headline */}
                    <h1 className="mt-8 font-serif text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                        Exceptional Design, Direct From Independent Boutiques.
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                        Explore handpicked technology, wardrobe essentials, and acoustic instruments from verified independent merchants. Every product is backed by centralized quality and independent care.
                    </p>

                    {/* Interactive Search Bar */}
                    <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-2xl">
                        <div className="relative flex items-center">
                            <Search className="absolute left-5 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products, brands, or boutique collections..."
                                className="w-full rounded-2xl border-0 bg-white/10 py-4 pl-14 pr-32 text-sm text-white placeholder-slate-400 backdrop-blur-md ring-1 ring-white/20 transition focus:bg-white focus:text-slate-950 focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-2.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-500"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Quick Category Chips */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
                        <span className="text-slate-400 font-medium">Popular:</span>
                        {categories.slice(0, 4).map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleFilterCategory(filters.category === cat ? null : cat)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                    filters.category === cat
                                        ? 'bg-white text-slate-950 font-bold'
                                        : 'bg-white/10 hover:bg-white/20 text-slate-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Commercial Trust Pillars */}
            <div className="border-b border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                <Truck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Express Global Delivery
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                    Free on orders over $150
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    100% Certified Authentic
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                    Direct from verified makers
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    30-Day Easy Returns
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                    Hassle-free exchange policy
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Encrypted Checkout
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                    256-bit bank-grade security
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Boutiques Showcase */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Independent Partners
                        </span>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            Featured Boutiques & Flagships
                        </h2>
                    </div>
                    <Link
                        href="/shops"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
                    >
                        <span>Explore All Boutiques</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {activeShops.map((shop) => (
                        <div
                            key={shop.id}
                            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 transition duration-300 ${
                                filters.shop === shop.slug
                                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/20'
                                    : 'border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900'
                            }`}
                        >
                            <div>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3.5">
                                        {shop.logo ? (
                                            <img
                                                src={shop.logo}
                                                alt={shop.name}
                                                className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">
                                                <Store className="h-6 w-6" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                {shop.name}
                                            </h3>
                                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-amber-500">
                                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                                    4.9
                                                </span>
                                                <span className="text-slate-400">
                                                    ({(shop.shop_products_count || 1) * 24}+ reviews)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Verified
                                    </span>
                                </div>

                                <p className="mt-4 text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
                                    {shop.description || 'Curated storefront offering customized products from the catalog.'}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-500">
                                    {shop.shop_products_count ?? 0} Curated Items
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFilterShop(filters.shop === shop.slug ? null : shop.slug)
                                        }
                                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                                            filters.shop === shop.slug
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        {filters.shop === shop.slug ? 'Filter Active' : 'Filter by Shop'}
                                    </button>
                                    <Link
                                        href={`/shops/${shop.slug}`}
                                        className="rounded-xl border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800"
                                        title="Visit Storefront"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Curated Product Showcase */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Header & Filter Controls */}
                <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                Available Inventory
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Curated Boutique Products
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Showing {shopProducts.total} items assigned to independent shops with store-specific pricing.
                            </p>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => handleFilterCategory(null)}
                                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                                    !filters.category
                                        ? 'bg-slate-950 text-white dark:bg-indigo-600'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                            >
                                All Categories
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => handleFilterCategory(cat)}
                                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                                        filters.category === cat
                                            ? 'bg-slate-950 text-white dark:bg-indigo-600'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filter Strip */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                            <span className="text-xs font-medium text-slate-500">Active Filters:</span>
                            {filters.search && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                    Search: "{filters.search}"
                                </span>
                            )}
                            {filters.shop && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                    Shop: {filters.shop}
                                    <button
                                        type="button"
                                        onClick={() => handleFilterShop(null)}
                                        className="text-indigo-400 hover:text-indigo-600"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {filters.category && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                    Category: {filters.category}
                                    <button
                                        type="button"
                                        onClick={() => handleFilterCategory(null)}
                                        className="text-indigo-400 hover:text-indigo-600"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-xs font-bold text-rose-600 hover:underline"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                {shopProducts.data.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                        <Package className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                            No boutique products match your filter
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Try resetting your search query or selecting a different category.
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {shopProducts.data.map((sp) => {
                            const title = sp.display_title || sp.product?.name || 'Untitled Product';
                            const thumbnail = sp.display_thumbnail || sp.product?.thumbnail;
                            const isCustomPrice =
                                sp.product && Number(sp.price) !== Number(sp.product.base_price);
                            const discountPercent =
                                sp.product && Number(sp.product.base_price) > Number(sp.price)
                                    ? Math.round(
                                          ((Number(sp.product.base_price) - Number(sp.price)) /
                                              Number(sp.product.base_price)) *
                                              100
                                      )
                                    : null;

                            return (
                                <div
                                    key={sp.id}
                                    className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                                >
                                    {/* Thumbnail container */}
                                    <Link
                                        href={`/shops/${sp.shop?.slug}/products/${sp.id}`}
                                        className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800"
                                    >
                                        {thumbnail ? (
                                            <img
                                                src={thumbnail}
                                                alt={title}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                <Package className="h-12 w-12" />
                                            </div>
                                        )}

                                        {/* Boutique badge tag */}
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-950/85 px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase text-white shadow-md backdrop-blur-md">
                                                <Store className="h-3 w-3 text-indigo-400" />
                                                {sp.shop?.name}
                                            </span>
                                        </div>

                                        {/* Discount badge if customized */}
                                        {discountPercent && discountPercent > 0 && (
                                            <div className="absolute top-3 right-3">
                                                <span className="rounded-lg bg-rose-600 px-2 py-1 text-[10px] font-black text-white shadow-md">
                                                    -{discountPercent}% OFF
                                                </span>
                                            </div>
                                        )}
                                    </Link>

                                    {/* Card Content */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                {sp.product?.category || 'General'}
                                            </span>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span className="font-bold text-slate-700 dark:text-slate-300">
                                                    4.9
                                                </span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <Link
                                            href={`/shops/${sp.shop?.slug}/products/${sp.id}`}
                                            className="mt-2 block"
                                        >
                                            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition dark:text-white dark:group-hover:text-indigo-400">
                                                {title}
                                            </h3>
                                        </Link>

                                        {/* Price & Stock info */}
                                        <div className="mt-4 flex items-baseline justify-between">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-black text-slate-950 dark:text-white">
                                                    ${Number(sp.price).toFixed(2)}
                                                </span>
                                                {isCustomPrice && sp.product && (
                                                    <span className="text-xs text-slate-400 line-through">
                                                        ${Number(sp.product.base_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                {sp.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="mt-5 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => handleAddToCart(e, sp)}
                                                disabled={sp.stock <= 0}
                                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition shadow-xs ${
                                                    addedId === sp.id
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40'
                                                }`}
                                            >
                                                {addedId === sp.id ? (
                                                    <>
                                                        <Check className="h-3.5 w-3.5" />
                                                        <span>Added to Bag!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingBag className="h-3.5 w-3.5" />
                                                        <span>Add to Bag</span>
                                                    </>
                                                )}
                                            </button>

                                            <Link
                                                href={`/shops/${sp.shop?.slug}/products/${sp.id}`}
                                                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {shopProducts.links && shopProducts.links.length > 3 && (
                    <div className="mt-12 flex justify-center">
                        <nav className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                            {shopProducts.links.map((link, idx) => {
                                const isCurrent = link.active;
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                                            isCurrent
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : link.url
                                                  ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                                  : 'cursor-not-allowed text-slate-300 dark:text-slate-700'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </nav>
                    </div>
                )}
            </section>

            {/* Merchant Network Banner */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl sm:p-12">
                    <div className="relative z-10 max-w-2xl">
                        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                            Velora Merchant Collective
                        </span>
                        <h3 className="mt-4 font-serif text-3xl font-black tracking-tight sm:text-4xl">
                            Are you an independent boutique or artisan creator?
                        </h3>
                        <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                            Join our shared product catalog platform. Distribute your flagship inventions across vetted boutiques or list curated catalog items with your own custom prices, branding, and localized inventory.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Link
                                href="/login"
                                className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-slate-100"
                            >
                                Open Merchant Account
                            </Link>
                            <Link
                                href="/shops"
                                className="rounded-xl border border-white/20 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
                            >
                                Browse Partner Boutiques
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </CustomerLayout>
    );
}
