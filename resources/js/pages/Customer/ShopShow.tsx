import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    Filter,
    Mail,
    MapPin,
    Package,
    Phone,
    Search,
    ShieldCheck,
    Store,
} from 'lucide-react';
import React, { useState } from 'react';
import CustomerLayout from '@/layouts/customer-layout';
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

    return (
        <CustomerLayout>
            <Head title={`${shop.name} - Storefront`} />

            {/* Shop Header Banner */}
            <div className="relative overflow-hidden bg-slate-900 text-white">
                <div className="h-48 w-full sm:h-64">
                    {shop.banner ? (
                        <img
                            src={shop.banner}
                            alt={shop.name}
                            className="h-full w-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-indigo-900 to-slate-900 opacity-60">
                            <Store className="h-20 w-20 text-white/20" />
                        </div>
                    )}
                </div>

                {/* Shop Profile Header */}
                <div className="border-b border-slate-800 bg-white/95 px-4 py-6 backdrop-blur-md dark:bg-slate-900/95 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                {/* Logo */}
                                <div className="-mt-16 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl dark:border-slate-900 dark:bg-slate-800">
                                    {shop.logo ? (
                                        <img
                                            src={shop.logo}
                                            alt={shop.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-white">
                                            <Store className="h-10 w-10" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {shop.name}
                                        </h1>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                            <CheckCircle2 className="h-3 w-3" /> Verified Shop
                                        </span>
                                    </div>
                                    <p className="mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-400">
                                        {shop.description || 'Welcome to our verified storefront.'}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Info Pills */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                {shop.phone && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                                        <Phone className="h-3.5 w-3.5 text-indigo-600" />
                                        {shop.phone}
                                    </span>
                                )}
                                {shop.email && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                                        <Mail className="h-3.5 w-3.5 text-indigo-600" />
                                        {shop.email}
                                    </span>
                                )}
                                {shop.address && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                                        <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                                        {shop.address}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back link + Breadcrumb */}
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-slate-500">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to All Showcase Products</span>
                    </Link>

                    <div className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Viewing products exclusively assigned to this shop</span>
                    </div>
                </div>
            </div>

            {/* Storefront Products Section */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Search & Categories Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                            <Filter className="h-3.5 w-3.5" /> Categories:
                        </span>
                        <button
                            type="button"
                            onClick={() => handleCategory(null)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                !filters.category
                                    ? 'bg-indigo-600 text-white'
                                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                            }`}
                        >
                            All in Store ({shopProducts.total})
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategory(filters.category === cat ? null : cat)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                    filters.category === cat
                                        ? 'bg-indigo-600 text-white'
                                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="max-w-xs">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search this store..."
                                className="w-full rounded-xl border border-slate-300 py-1.5 pl-9 pr-16 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-600 dark:bg-slate-700"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Grid */}
                <div className="mt-8">
                    {shopProducts.data.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                            <Package className="mx-auto h-12 w-12 text-slate-400" />
                            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                                No products found in this store
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                This store has not listed items matching this filter yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {shopProducts.data.map((item) => {
                                const title = item.display_title || item.product?.name || 'Untitled';
                                const thumbnail = item.display_thumbnail || item.product?.thumbnail;
                                const description = item.display_description || item.product?.description;

                                return (
                                    <div
                                        key={item.id}
                                        className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                                    >
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

                                            {item.product?.category && (
                                                <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold text-slate-800 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-200">
                                                    {item.product.category}
                                                </span>
                                            )}

                                            {item.custom_thumbnail && (
                                                <span className="absolute top-3 right-3 rounded-md bg-indigo-600/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                                                    Shop Custom Image
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-4">
                                            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                {title}
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500 line-clamp-2 flex-1">
                                                {description}
                                            </p>

                                            <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                                                <div>
                                                    <span className="block text-[10px] uppercase font-semibold text-slate-400">
                                                        Store Price
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

                                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/shops/${shop.slug}/products/${item.id}`}
                                                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                <span>View Product</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
