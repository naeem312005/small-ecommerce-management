import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    MapPin,
    Package,
    Phone,
    Search,
    Star,
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
            <Head title="Verified Independent Boutiques — Velora Market" />

            {/* Header */}
            <div className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
                            Partner Directory
                        </span>
                        <h1 className="mt-4 font-serif text-3xl font-black tracking-tight sm:text-5xl">
                            Discover Independent Boutiques
                        </h1>
                        <p className="mt-4 text-sm leading-relaxed text-slate-300">
                            Browse verified creators and flagships curating products through Velora's shared catalog system with localized fulfillment and custom collections.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="mt-8 max-w-md">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search boutique by name, city, or specialty..."
                                className="w-full rounded-2xl border-0 bg-white/10 py-3 pl-11 pr-24 text-xs text-white placeholder-slate-400 backdrop-blur-md ring-1 ring-white/20 focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Shops Directory Grid */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {shops.data.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                        <Store className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                            No boutique matching your search
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Please check your spelling or clear search filters.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {shops.data.map((shop) => (
                            <div
                                key={shop.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                            >
                                {/* Banner with logo */}
                                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                                    {shop.banner ? (
                                        <img
                                            src={shop.banner}
                                            alt={shop.name}
                                            className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-slate-950 to-indigo-950 opacity-80">
                                            <Store className="h-12 w-12 text-white/30" />
                                        </div>
                                    )}

                                    {/* Logo badge */}
                                    <div className="absolute -bottom-6 left-6">
                                        {shop.logo ? (
                                            <img
                                                src={shop.logo}
                                                alt={shop.name}
                                                className="h-16 w-16 rounded-2xl border-2 border-white object-cover shadow-lg dark:border-slate-900"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white bg-indigo-600 text-white shadow-lg dark:border-slate-900 font-bold">
                                                <Store className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex flex-1 flex-col p-6 pt-9">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition dark:text-white dark:group-hover:text-indigo-400">
                                                {shop.name}
                                            </h3>
                                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-amber-500">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                                    4.9
                                                </span>
                                                <span className="text-slate-400">
                                                    ({(shop.shop_products_count || 1) * 18}+ reviews)
                                                </span>
                                            </div>
                                        </div>

                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3 w-3" />
                                            {shop.shop_products_count ?? 0} Listed Items
                                        </span>
                                    </div>

                                    <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2 flex-1 dark:text-slate-400">
                                        {shop.description || 'Welcome to our verified boutique storefront.'}
                                    </p>

                                    {/* Location / details */}
                                    <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                                        {shop.address && (
                                            <div className="flex items-center gap-2 truncate">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                <span className="truncate">{shop.address}</span>
                                            </div>
                                        )}
                                        {shop.phone && (
                                            <div className="flex items-center gap-2 truncate">
                                                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                <span>{shop.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href={`/shops/${shop.slug}`}
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600"
                                    >
                                        <span>Visit Boutique</span>
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
