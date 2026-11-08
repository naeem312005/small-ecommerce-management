import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Eye,
    Mail,
    MapPin,
    Package,
    Phone,
    Search,
    ShoppingBag,
    Star,
    Store,
} from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';
import CustomerLayout from '@/layouts/customer-layout';
import { notify } from '@/lib/alert';
import type { PaginatedData, Shop, ShopProduct } from '@/types';

type Props = {
    shop: Shop;
    shopProducts: PaginatedData<ShopProduct>;
    categories: string[];
    filters: {
        category?: string;
        search?: string;
    };
};

export default function CustomerShopShow({
    shop,
    shopProducts,
    categories,
    filters,
}: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const { addItem } = useCart();
    const [addedId, setAddedId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            `/shops/${shop.slug}`,
            {
                ...filters,
                search: searchTerm,
            },
            { preserveState: true }
        );
    };

    const handleCategory = (category: string | null) => {
        router.get(
            `/shops/${shop.slug}`,
            {
                ...filters,
                category: category || undefined,
            },
            { preserveState: true }
        );
    };

    const handleAddToCart = (e: React.MouseEvent, sp: ShopProduct) => {
        e.preventDefault();
        e.stopPropagation();

        const title = sp.display_title || sp.product?.name || 'Untitled';
        const thumb = sp.display_thumbnail || sp.product?.thumbnail;

        addItem({
            id: sp.id,
            shopId: shop.id,
            shopName: shop.name,
            shopSlug: shop.slug,
            title,
            price: Number(sp.price),
            thumbnail: thumb,
            stock: sp.stock,
            quantity: 1,
        });

        notify.success(`Added to bag!`, `${title} (${shop.name})`);

        setAddedId(sp.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    return (
        <CustomerLayout>
            <Head title={`${shop.name} — Verified Boutique Storefront | Velora`} />

            {/* Shop Header Banner */}
            <div className="relative overflow-hidden bg-[#0F172A] text-white">
                <div className="h-48 w-full sm:h-64">
                    {shop.banner ? (
                        <img
                            src={shop.banner}
                            alt={shop.name}
                            className="h-full w-full object-cover opacity-75"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#0F172A] opacity-90">
                            <Store className="h-20 w-20 text-white/20" />
                        </div>
                    )}
                </div>

                {/* Profile Floating Strip */}
                <div className="border-b border-[#E2E8F0] bg-white px-4 py-6 dark:border-[#334155] dark:bg-[#1E293B] sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                {/* Logo Avatar */}
                                <div className="-mt-16 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl dark:border-[#1E293B] dark:bg-[#0F172A]">
                                    {shop.logo ? (
                                        <img
                                            src={shop.logo}
                                            alt={shop.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[#2563EB] text-white font-bold">
                                            <Store className="h-10 w-10" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <h1 className="font-serif text-2xl font-black tracking-tight text-[#0F172A] sm:text-3xl dark:text-white">
                                            {shop.name}
                                        </h1>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#16A34A]/10 px-2.5 py-0.5 text-xs font-bold text-[#16A34A] border border-[#16A34A]/20">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Verified Boutique
                                        </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-[#64748B]">
                                        <div className="flex items-center text-[#F59E0B]">
                                            <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                                            <span className="ml-1 font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                4.9
                                            </span>
                                        </div>
                                        <span>•</span>
                                        <span>{shopProducts.total} Listed Products</span>
                                        {shop.owner && (
                                            <>
                                                <span>•</span>
                                                <span>Curated by {shop.owner.name}</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="mt-2 max-w-2xl text-xs text-[#64748B] dark:text-[#94A3B8]">
                                        {shop.description || 'Welcome to our verified boutique storefront.'}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Badges */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                                {shop.phone && (
                                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 shadow-2xs dark:border-[#334155] dark:bg-[#0F172A]">
                                        <Phone className="h-3.5 w-3.5 text-[#2563EB]" />
                                        {shop.phone}
                                    </span>
                                )}
                                {shop.email && (
                                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 shadow-2xs dark:border-[#334155] dark:bg-[#0F172A]">
                                        <Mail className="h-3.5 w-3.5 text-[#2563EB]" />
                                        {shop.email}
                                    </span>
                                )}
                                {shop.address && (
                                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 shadow-2xs dark:border-[#334155] dark:bg-[#0F172A]">
                                        <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
                                        {shop.address}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 dark:border-[#334155] dark:bg-[#0F172A]">
                <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-[#64748B]">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 font-semibold text-[#0F172A] hover:text-[#2563EB] dark:text-[#F8FAFC] dark:hover:text-[#3B82F6] transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>All Boutique Products</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link href="/shops" className="hover:text-[#2563EB] transition-colors">
                            Boutiques Directory
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                            {shop.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Store Products Section */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Search & Filter Strip */}
                <div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-6 md:flex-row md:items-center md:justify-between dark:border-[#334155]">
                    {/* Category tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => handleCategory(null)}
                            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                                !filters.category
                                    ? 'bg-[#2563EB] text-white shadow-xs'
                                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:bg-[#1E293B] dark:border-[#334155] dark:text-[#94A3B8]'
                            }`}
                        >
                            All Products ({shopProducts.total})
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategory(cat)}
                                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                                    filters.category === cat
                                        ? 'bg-[#2563EB] text-white shadow-xs'
                                        : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:bg-[#1E293B] dark:border-[#334155] dark:text-[#94A3B8]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search inside shop */}
                    <form onSubmit={handleSearch} className="relative w-full max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={`Search ${shop.name}...`}
                            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2 pl-9 pr-16 text-xs text-[#0F172A] placeholder-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none dark:border-[#334155] dark:bg-[#1E293B] dark:text-white"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[#2563EB] px-3 py-1 text-xs font-bold text-white hover:bg-[#1D4ED8] transition"
                        >
                            Find
                        </button>
                    </form>
                </div>

                {/* Products Grid */}
                {shopProducts.data.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center dark:border-[#334155] dark:bg-[#1E293B]">
                        <Package className="mx-auto h-12 w-12 text-[#64748B]" />
                        <h3 className="mt-3 text-base font-bold text-[#0F172A] dark:text-white">
                            No products found in {shop.name}
                        </h3>
                        <p className="mt-1 text-xs text-[#64748B]">
                            Try clearing your search filters to see all available inventory.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {shopProducts.data.map((sp) => {
                            const title = sp.display_title || sp.product?.name || 'Untitled';
                            const thumbnail = sp.display_thumbnail || sp.product?.thumbnail;
                            const isCustomPrice =
                                sp.product && Number(sp.price) !== Number(sp.product.base_price);

                            return (
                                <div
                                    key={sp.id}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-xl dark:border-[#334155] dark:bg-[#1E293B]"
                                >
                                    <Link
                                        href={`/shops/${shop.slug}/products/${sp.id}`}
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
                                    </Link>

                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                                            <span className="font-semibold text-[#2563EB] dark:text-blue-400">
                                                {sp.product?.category || 'Specialty'}
                                            </span>
                                            <span className="text-[#16A34A] font-semibold">
                                                {sp.stock > 0 ? `${sp.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/shops/${shop.slug}/products/${sp.id}`}
                                            className="mt-2 block"
                                        >
                                            <h3 className="text-sm font-bold text-[#0F172A] line-clamp-2 group-hover:text-[#2563EB] dark:text-white dark:group-hover:text-blue-400 transition-colors">
                                                {title}
                                            </h3>
                                        </Link>

                                        <div className="mt-4 flex items-baseline justify-between">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-black text-[#0F172A] dark:text-white">
                                                    ${Number(sp.price).toFixed(2)}
                                                </span>
                                                {isCustomPrice && sp.product && (
                                                    <span className="text-xs text-[#64748B] line-through">
                                                        ${Number(sp.product.base_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
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
                                                href={`/shops/${shop.slug}/products/${sp.id}`}
                                                className="rounded-xl border border-[#E2E8F0] p-2.5 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:border-[#334155] dark:text-[#94A3B8] dark:hover:bg-[#0F172A] transition-colors"
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
                        <nav className="flex items-center gap-1 rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-xs dark:border-[#334155] dark:bg-[#1E293B]">
                            {shopProducts.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                                        link.active
                                            ? 'bg-[#2563EB] text-white shadow-xs'
                                            : link.url
                                              ? 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:bg-[#0F172A]'
                                              : 'cursor-not-allowed text-[#CBD5E1] dark:text-[#475569]'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
