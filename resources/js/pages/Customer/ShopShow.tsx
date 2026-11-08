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
    X,
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
            <div className="relative overflow-hidden bg-slate-950 text-white">
                <div className="h-56 w-full sm:h-72">
                    {shop.banner ? (
                        <img
                            src={shop.banner}
                            alt={shop.name}
                            className="h-full w-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 opacity-80">
                            <Store className="h-24 w-24 text-white/20" />
                        </div>
                    )}
                </div>

                {/* Profile Floating Strip */}
                <div className="border-b border-slate-200 bg-white/95 px-4 py-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                {/* Logo Avatar */}
                                <div className="-mt-20 h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl dark:border-slate-900 dark:bg-slate-800">
                                    {shop.logo ? (
                                        <img
                                            src={shop.logo}
                                            alt={shop.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-white font-bold">
                                            <Store className="h-10 w-10" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <h1 className="font-serif text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                                            {shop.name}
                                        </h1>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Verified Boutique
                                        </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                        <div className="flex items-center text-amber-500">
                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                            <span className="ml-1 font-bold text-slate-800 dark:text-slate-200">
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
                                    <p className="mt-2 max-w-2xl text-xs text-slate-600 dark:text-slate-400">
                                        {shop.description || 'Welcome to our verified boutique storefront.'}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Badges */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                {shop.phone && (
                                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
                                        <Phone className="h-3.5 w-3.5 text-indigo-600" />
                                        {shop.phone}
                                    </span>
                                )}
                                {shop.email && (
                                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
                                        <Mail className="h-3.5 w-3.5 text-indigo-600" />
                                        {shop.email}
                                    </span>
                                )}
                                {shop.address && (
                                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
                                        <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                                        {shop.address}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-slate-500">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>All Boutique Products</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link href="/shops" className="hover:text-indigo-600">
                            Boutiques Directory
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {shop.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Store Products Section */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Search & Filter Strip */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between dark:border-slate-800">
                    {/* Category tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => handleCategory(null)}
                            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                                !filters.category
                                    ? 'bg-slate-950 text-white dark:bg-indigo-600'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
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
                                        ? 'bg-slate-950 text-white dark:bg-indigo-600'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search inside shop */}
                    <form onSubmit={handleSearch} className="relative w-full max-w-xs">
                        <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={`Search ${shop.name}...`}
                            className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-16 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white hover:bg-indigo-500"
                        >
                            Find
                        </button>
                    </form>
                </div>

                {/* Products Grid */}
                {shopProducts.data.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                        <Package className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                            No products found in {shop.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
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
                                    className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <Link
                                        href={`/shops/${shop.slug}/products/${sp.id}`}
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
                                    </Link>

                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                {sp.product?.category || 'Specialty'}
                                            </span>
                                            <span className="text-emerald-600 font-semibold">
                                                {sp.stock > 0 ? `${sp.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/shops/${shop.slug}/products/${sp.id}`}
                                            className="mt-2 block"
                                        >
                                            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                {title}
                                            </h3>
                                        </Link>

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
                                        </div>

                                        {/* Actions */}
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
                                                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
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
                            {shopProducts.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : link.url
                                              ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                              : 'cursor-not-allowed text-slate-300 dark:text-slate-700'
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
