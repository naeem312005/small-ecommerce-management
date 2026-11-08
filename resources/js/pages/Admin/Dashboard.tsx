import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    Layers,
    Package,
    Plus,
    Shield,
    Sparkles,
    Store,
    Users,
} from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Product, Shop, User } from '@/types';

type Stats = {
    total_shops: number;
    active_shops: number;
    total_products: number;
    active_products: number;
    total_shop_owners: number;
    total_shop_listings: number;
};

type Props = {
    stats: Stats;
    recentShops: Shop[];
    recentProducts: Product[];
    recentOwners: User[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin/dashboard' },
    { title: 'Overview', href: '/admin/dashboard' },
];

export default function AdminDashboard({
    stats,
    recentShops,
    recentProducts,
    recentOwners,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Platform Overview — Admin Console" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Welcome / Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 sm:p-8 text-white shadow-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(99,102,241,0.3),rgba(255,255,255,0))]" />
                    <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                                <Shield className="h-3.5 w-3.5" />
                                <span>Platform Administration</span>
                            </div>
                            <h1 className="mt-3 font-serif text-2xl font-black tracking-tight sm:text-3xl">
                                Velora Marketplace Console
                            </h1>
                            <p className="mt-1 text-xs text-slate-300">
                                Real-time oversight across independent storefronts, central catalog distribution, and merchant accounts.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href="/admin/shops/create"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-slate-100"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>New Shop</span>
                            </Link>
                            <Link
                                href="/admin/products/create"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>New Product</span>
                            </Link>
                            <Link
                                href="/admin/shop-owners/create"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Register Merchant</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Shops */}
                    <div className="group rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Merchant Shops
                            </span>
                            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                <Store className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
                            {stats.total_shops}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {stats.active_shops} Active Stores
                            </span>
                            <Link
                                href="/admin/shops"
                                className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                Manage →
                            </Link>
                        </div>
                    </div>

                    {/* Shared Products */}
                    <div className="group rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Catalog Products
                            </span>
                            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <Package className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
                            {stats.total_products}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {stats.active_products} Live in Catalog
                            </span>
                            <Link
                                href="/admin/products"
                                className="font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                            >
                                Manage →
                            </Link>
                        </div>
                    </div>

                    {/* Shop Owners */}
                    <div className="group rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Merchant Accounts
                            </span>
                            <div className="rounded-xl bg-violet-50 p-2 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
                            {stats.total_shop_owners}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                            <span className="text-slate-500">Verified Operators</span>
                            <Link
                                href="/admin/shop-owners"
                                className="font-bold text-violet-600 hover:underline dark:text-violet-400"
                            >
                                Manage →
                            </Link>
                        </div>
                    </div>

                    {/* Shop Listings */}
                    <div className="group rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Active Store Listings
                            </span>
                            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                                <Layers className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
                            {stats.total_shop_listings}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                            <span className="text-slate-500">Distributed Across Stores</span>
                            <Link
                                href="/"
                                className="font-bold text-amber-600 hover:underline dark:text-amber-400"
                            >
                                Storefront →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Activities Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Shops */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Store className="h-4 w-4 text-indigo-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Recent Merchant Shops
                                </h3>
                            </div>
                            <Link
                                href="/admin/shops"
                                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/80">
                            {recentShops.map((shop) => (
                                <div
                                    key={shop.id}
                                    className="flex items-center justify-between py-3.5"
                                >
                                    <div className="flex items-center gap-3">
                                        {shop.logo ? (
                                            <img
                                                src={shop.logo}
                                                alt={shop.name}
                                                className="h-10 w-10 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">
                                                <Store className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                {shop.name}
                                            </h4>
                                            <p className="text-[11px] text-slate-400">
                                                {shop.owner ? `Owned by ${shop.owner.name}` : 'No Owner'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            {shop.shop_products_count ?? 0} Listed
                                        </span>
                                        <a
                                            href={`/shops/${shop.slug}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                                        >
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Recent Catalog Additions
                                </h3>
                            </div>
                            <Link
                                href="/admin/products"
                                className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/80">
                            {recentProducts.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="flex items-center justify-between py-3.5"
                                >
                                    <div className="flex items-center gap-3">
                                        {prod.thumbnail ? (
                                            <img
                                                src={prod.thumbnail}
                                                alt={prod.name}
                                                className="h-10 w-10 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                                                <Package className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1 dark:text-white">
                                                {prod.name}
                                            </h4>
                                            <p className="text-[11px] text-slate-400">
                                                {prod.category} • SKU: {prod.sku}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                            ${Number(prod.base_price).toFixed(2)}
                                        </span>
                                        <span className="block text-[10px] text-slate-400">MSRP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
