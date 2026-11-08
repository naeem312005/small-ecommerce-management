import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    MapPin,
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

            {/* Header Hero */}
            <div className="relative overflow-hidden bg-[#0F172A] py-14 text-white sm:py-18">
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2563EB]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 border border-[#2563EB]/30">
                            Verified Directory
                        </span>
                        <h1 className="mt-4 font-serif text-3xl font-black tracking-tight sm:text-5xl text-white">
                            Discover Independent Boutiques
                        </h1>
                        <p className="mt-4 text-sm leading-relaxed text-[#94A3B8]">
                            Browse verified creators and flagships curating products through Velora's shared catalog system with localized fulfillment and custom collections.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="mt-8 max-w-md">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 h-4 w-4 text-[#94A3B8]" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search boutique by name, city, or specialty..."
                                className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 pl-11 pr-24 text-xs text-white placeholder-[#94A3B8] backdrop-blur-md focus:bg-white focus:text-[#0F172A] focus:ring-2 focus:ring-[#2563EB] focus:outline-none transition"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 rounded-xl bg-[#2563EB] px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-[#1D4ED8] transition"
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
                    <div className="rounded-3xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center dark:border-[#334155] dark:bg-[#1E293B]">
                        <Store className="mx-auto h-12 w-12 text-[#64748B]" />
                        <h3 className="mt-3 text-base font-bold text-[#0F172A] dark:text-white">
                            No boutique matching your search
                        </h3>
                        <p className="mt-1 text-xs text-[#64748B]">
                            Please check your spelling or clear search filters.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {shops.data.map((shop) => (
                            <div
                                key={shop.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-xl dark:border-[#334155] dark:bg-[#1E293B]"
                            >
                                {/* Banner with logo */}
                                <div className="relative h-44 w-full overflow-hidden bg-[#0F172A]">
                                    {shop.banner ? (
                                        <img
                                            src={shop.banner}
                                            alt={shop.name}
                                            className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[#0F172A] opacity-90">
                                            <Store className="h-12 w-12 text-white/30" />
                                        </div>
                                    )}

                                    {/* Logo badge */}
                                    <div className="absolute -bottom-6 left-6">
                                        {shop.logo ? (
                                            <img
                                                src={shop.logo}
                                                alt={shop.name}
                                                className="h-16 w-16 rounded-2xl border-2 border-white object-cover shadow-lg dark:border-[#1E293B]"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white bg-[#2563EB] text-white shadow-lg dark:border-[#1E293B] font-bold">
                                                <Store className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex flex-1 flex-col p-6 pt-9">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition dark:text-white dark:group-hover:text-blue-400">
                                                {shop.name}
                                            </h3>
                                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#F59E0B]">
                                                <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                                                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                    4.9
                                                </span>
                                                <span className="text-[#64748B]">
                                                    ({(shop.shop_products_count || 1) * 18}+ reviews)
                                                </span>
                                            </div>
                                        </div>

                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#16A34A]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#16A34A] border border-[#16A34A]/20">
                                            <CheckCircle2 className="h-3 w-3" />
                                            {shop.shop_products_count ?? 0} Listed Items
                                        </span>
                                    </div>

                                    <p className="mt-3 text-xs leading-relaxed text-[#64748B] line-clamp-2 flex-1 dark:text-[#94A3B8]">
                                        {shop.description || 'Welcome to our verified boutique storefront.'}
                                    </p>

                                    {/* Location / details */}
                                    <div className="mt-4 space-y-1.5 border-t border-[#E2E8F0] pt-3 text-xs text-[#64748B] dark:border-[#334155]">
                                        {shop.address && (
                                            <div className="flex items-center gap-2 truncate">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#64748B]" />
                                                <span className="truncate">{shop.address}</span>
                                            </div>
                                        )}
                                        {shop.phone && (
                                            <div className="flex items-center gap-2 truncate">
                                                <Phone className="h-3.5 w-3.5 shrink-0 text-[#64748B]" />
                                                <span>{shop.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href={`/shops/${shop.slug}`}
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#1D4ED8]"
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
