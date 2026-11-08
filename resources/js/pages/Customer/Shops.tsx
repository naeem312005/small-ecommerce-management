import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    MapPin,
    Phone,
    Search,
    Store,
} from 'lucide-react';
import React, { useState } from 'react';
import CustomerLayout from '@/layouts/customer-layout';
import type { PaginatedData, Shop } from '@/types';

type Props = {
    shops: PaginatedData<Shop>;
    filters: {
        search?: string;
    };
};

export default function CustomerShops({ shops, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/shops', { search }, { preserveState: true });
    };

    return (
        <CustomerLayout>
            <Head title="Browse Shops - Multi-Store Platform" />

            {/* Header */}
            <div className="border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Merchant Directory
                        </span>
                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Discover Active Independent Shops
                        </h1>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                            Each shop curates products from our shared catalog with custom pricing and localized inventory.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="mt-6 max-w-md">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search shops by name, address, or details..."
                                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-20 text-xs shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Shops Grid */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {shops.data.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                        <Store className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                            No shops found
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Try adjusting your search criteria.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {shops.data.map((shop) => (
                            <div
                                key={shop.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                            >
                                {/* Banner */}
                                <div className="relative h-36 w-full overflow-hidden bg-gradient-to-r from-indigo-900 to-slate-900">
                                    {shop.banner ? (
                                        <img
                                            src={shop.banner}
                                            alt={shop.name}
                                            className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center opacity-30">
                                            <Store className="h-12 w-12 text-white" />
                                        </div>
                                    )}
                                    {/* Logo badge overlay */}
                                    <div className="absolute -bottom-6 left-6">
                                        {shop.logo ? (
                                            <img
                                                src={shop.logo}
                                                alt={shop.name}
                                                className="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-md dark:border-slate-900"
                                            />
                                        ) : (
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-indigo-600 text-white shadow-md dark:border-slate-900">
                                                <Store className="h-7 w-7" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex flex-1 flex-col p-6 pt-9">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                {shop.name}
                                            </h3>
                                            {shop.owner && (
                                                <p className="text-xs text-slate-500">
                                                    Operated by {shop.owner.name}
                                                </p>
                                            )}
                                        </div>

                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3 w-3" />
                                            {shop.shop_products_count ?? 0} Items
                                        </span>
                                    </div>

                                    <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2 flex-1 dark:text-slate-400">
                                        {shop.description || 'Welcome to our shop storefront.'}
                                    </p>

                                    {/* Info items */}
                                    <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                                        {shop.address && (
                                            <div className="flex items-center gap-1.5 truncate">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                <span className="truncate">{shop.address}</span>
                                            </div>
                                        )}
                                        {shop.phone && (
                                            <div className="flex items-center gap-1.5 truncate">
                                                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                <span>{shop.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Link */}
                                    <Link
                                        href={`/shops/${shop.slug}`}
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500"
                                    >
                                        <span>Enter Storefront</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
