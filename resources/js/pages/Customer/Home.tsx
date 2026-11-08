import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    Eye,
    Package,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Store,
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

        notify.success(`Added "${title}" to your bag!`);
        setAddedId(sp.id);
        setTimeout(() => setAddedId(null), 1800);
    };

    const hasActiveFilters = Boolean(filters.search || filters.category || filters.shop);

    return (
        <CustomerLayout>
            <Head title="Velora Market — Premium Multi-Vendor Commerce" />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-[#FFFFFF] py-16 sm:py-24 dark:border-[#334155] dark:bg-[#0F172A]">
                <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                    {/* Eyebrow Chip */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                        <span>Verified Multi-Boutique Marketplace</span>
                    </div>

                    {/* Headline */}
                    <h1 className="mt-6 text-3xl font-black tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl dark:text-[#F8FAFC]">
                        Modern Goods Direct From Independent Boutiques.
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base dark:text-[#94A3B8]">
                        Discover handcrafted wardrobe essentials, acoustic instruments, and cutting-edge electronics. Every product is backed by centralized inventory standards and boutique merchant care.
                    </p>

                    {/* Action CTAs */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="#showcase"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1D4ED8]"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            <span>Browse Showcase Items</span>
                        </a>
                        <Link
                            href="/shops"
                            className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-6 py-3.5 text-xs font-semibold text-[#0F172A] shadow-xs transition hover:bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                        >
                            <Store className="h-4 w-4 text-[#64748B]" />
                            <span>Explore Boutiques Directory</span>
                        </Link>
                    </div>

                    {/* Hero Search Box */}
                    <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-xl">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 h-4 w-4 text-[#64748B]" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by product title, brand, or SKU..."
                                className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] py-3.5 pl-11 pr-28 text-xs text-[#0F172A] placeholder-[#64748B] focus:border-[#2563EB] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#2563EB] transition dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Trust Pillars */}
            <section className="border-b border-[#E2E8F0] bg-[#FFFFFF] py-6 dark:border-[#334155] dark:bg-[#0F172A]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                                <Truck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    Express Global Delivery
                                </h4>
                                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                                    Complimentary on orders $150+
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#16A34A] dark:bg-emerald-950/50 dark:text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    100% Authentic Products
                                </h4>
                                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                                    Direct from verified boutiques
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#F59E0B] dark:bg-amber-950/50 dark:text-amber-400">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    30-Day Simple Returns
                                </h4>
                                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                                    Hassle-free refunds & exchanges
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    Secure Encrypted Checkout
                                </h4>
                                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                                    PCI-DSS 256-bit safe payments
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Merchant Boutiques */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                            Verified Storefronts
                        </span>
                        <h2 className="text-xl font-black tracking-tight text-[#0F172A] sm:text-2xl dark:text-[#F8FAFC]">
                            Independent Merchant Boutiques
                        </h2>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                            Browse independent shops that curate and customize items from the shared master catalog.
                        </p>
                    </div>

                    <Link
                        href="/shops"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline"
                    >
                        <span>View all {activeShops.length} boutiques</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {activeShops.slice(0, 3).map((shop) => (
                        <div
                            key={shop.id}
                            className={`flex flex-col justify-between rounded-2xl border bg-[#FFFFFF] p-6 shadow-xs transition hover:shadow-md dark:bg-[#1E293B] ${
                                filters.shop === shop.slug
                                    ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20'
                                    : 'border-[#E2E8F0] dark:border-[#334155]'
                            }`}
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        {shop.logo ? (
                                            <img
                                                src={shop.logo}
                                                alt={shop.name}
                                                className="h-12 w-12 rounded-xl object-cover ring-1 ring-[#E2E8F0] dark:ring-[#334155]"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB] text-white font-bold">
                                                <Store className="h-6 w-6" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                {shop.name}
                                            </h3>
                                            <span className="font-mono text-[11px] text-[#2563EB]">
                                                /shops/{shop.slug}
                                            </span>
                                        </div>
                                    </div>

                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#16A34A] dark:bg-emerald-950 dark:text-emerald-300">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Verified
                                    </span>
                                </div>

                                <p className="mt-3 text-xs leading-relaxed text-[#64748B] line-clamp-2 dark:text-[#94A3B8]">
                                    {shop.description || 'Specialty boutique offering customized products from the catalog.'}
                                </p>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-[#E2E8F0] pt-4 dark:border-[#334155]">
                                <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
                                    {shop.shop_products_count ?? 0} Listed Items
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFilterShop(filters.shop === shop.slug ? null : shop.slug)
                                        }
                                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                                            filters.shop === shop.slug
                                                ? 'bg-[#2563EB] text-white'
                                                : 'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0] dark:bg-[#334155] dark:text-[#F8FAFC]'
                                        }`}
                                    >
                                        {filters.shop === shop.slug ? 'Filter Active' : 'Filter by Shop'}
                                    </button>
                                    <Link
                                        href={`/shops/${shop.slug}`}
                                        className="rounded-xl border border-[#E2E8F0] p-1.5 text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:border-[#334155] dark:hover:bg-[#334155]"
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

            {/* Product Catalog Showcase */}
            <section id="showcase" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header & Category Filter Controls */}
                <div className="border-b border-[#E2E8F0] pb-5 dark:border-[#334155]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                                Active Inventory
                            </span>
                            <h2 className="text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                                Curated Boutique Products
                            </h2>
                            <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
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
                                        ? 'bg-[#2563EB] text-white shadow-xs'
                                        : 'bg-[#FFFFFF] text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#94A3B8]'
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
                                            ? 'bg-[#2563EB] text-white shadow-xs'
                                            : 'bg-[#FFFFFF] text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#94A3B8]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filter Strip */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#334155]">
                            <span className="text-xs font-medium text-[#64748B]">Active Filters:</span>
                            {filters.search && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                                    Search: "{filters.search}"
                                </span>
                            )}
                            {filters.shop && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                                    Shop: {filters.shop}
                                    <button
                                        type="button"
                                        onClick={() => handleFilterShop(null)}
                                        className="text-[#2563EB] hover:opacity-75"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {filters.category && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                                    Category: {filters.category}
                                    <button
                                        type="button"
                                        onClick={() => handleFilterCategory(null)}
                                        className="text-[#2563EB] hover:opacity-75"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-xs font-bold text-[#DC2626] hover:underline"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                {shopProducts.data.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-[#E2E8F0] bg-[#FFFFFF] p-12 text-center dark:border-[#334155] dark:bg-[#1E293B]">
                        <Package className="mx-auto h-12 w-12 text-[#64748B]" />
                        <h3 className="mt-3 text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                            No boutique products match your filter
                        </h3>
                        <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                            Try resetting your search query or selecting a different category.
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1D4ED8]"
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
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-lg dark:border-[#334155] dark:bg-[#1E293B]"
                                >
                                    {/* Thumbnail container */}
                                    <Link
                                        href={`/shops/${sp.shop?.slug}/products/${sp.id}`}
                                        className="relative aspect-square w-full overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A]"
                                    >
                                        {thumbnail ? (
                                            <img
                                                src={thumbnail}
                                                alt={title}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[#64748B]">
                                                <Package className="h-12 w-12" />
                                            </div>
                                        )}

                                        {/* Boutique badge tag */}
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#0F172A] border border-[#E2E8F0] shadow-xs backdrop-blur-sm dark:bg-[#0F172A]/90 dark:text-[#F8FAFC] dark:border-[#334155]">
                                                <Store className="h-3 w-3 text-[#2563EB]" />
                                                {sp.shop?.name}
                                            </span>
                                        </div>

                                        {/* Discount badge if customized */}
                                        {discountPercent && discountPercent > 0 && (
                                            <div className="absolute top-3 right-3">
                                                <span className="rounded-lg bg-[#DC2626] px-2 py-1 text-[10px] font-black text-white shadow-xs">
                                                    -{discountPercent}% OFF
                                                </span>
                                            </div>
                                        )}
                                    </Link>

                                    {/* Card Content */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                                            <span className="font-semibold text-[#2563EB]">
                                                {sp.product?.category || 'General'}
                                            </span>
                                            <div className="flex items-center gap-1 text-[#F59E0B]">
                                                <Star className="h-3 w-3 fill-[#F59E0B]" />
                                                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                    4.9
                                                </span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <Link
                                            href={`/shops/${sp.shop?.slug}/products/${sp.id}`}
                                            className="mt-2 block"
                                        >
                                            <h3 className="text-sm font-bold text-[#0F172A] line-clamp-2 transition hover:text-[#2563EB] dark:text-[#F8FAFC] dark:hover:text-[#3B82F6]">
                                                {title}
                                            </h3>
                                        </Link>

                                        {/* Price & Stock info */}
                                        <div className="mt-4 flex items-baseline justify-between">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-black text-[#0F172A] dark:text-[#F8FAFC]">
                                                    ${Number(sp.price).toFixed(2)}
                                                </span>
                                                {isCustomPrice && sp.product && (
                                                    <span className="text-xs text-[#64748B] line-through">
                                                        ${Number(sp.product.base_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[11px] font-semibold text-[#16A34A]">
                                                {sp.stock > 0 ? '● In Stock' : 'Out of Stock'}
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
                                                        ? 'bg-[#16A34A] text-white'
                                                        : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-40'
                                                }`}
                                            >
                                                {addedId === sp.id ? (
                                                    <>
                                                        <Check className="h-3.5 w-3.5" />
                                                        <span>Added!</span>
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
                                                className="rounded-xl border border-[#E2E8F0] p-2.5 text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:border-[#334155] dark:hover:bg-[#334155]"
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
                        <nav className="flex items-center gap-1 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-1.5 shadow-xs dark:border-[#334155] dark:bg-[#1E293B]">
                            {shopProducts.links.map((link, idx) => {
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                                            link.active
                                                ? 'bg-[#2563EB] text-white shadow-xs'
                                                : !link.url
                                                  ? 'cursor-not-allowed text-[#64748B]/40'
                                                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:hover:bg-[#334155]'
                                        }`}
                                    />
                                );
                            })}
                        </nav>
                    </div>
                )}
            </section>
        </CustomerLayout>
    );
}
