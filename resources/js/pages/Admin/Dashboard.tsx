import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Layers,
    Package,
    Plus,
    Shield,
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
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Dashboard', href: '/admin/dashboard' },
];

export default function AdminDashboard({
    stats,
    recentShops,
    recentProducts,
    recentOwners,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard - Small E-commerce Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Welcome / Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-lg">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-200">
                                <Shield className="h-3.5 w-3.5" />
                                <span>Platform Administrator Control Center</span>
                            </div>
                            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                                System Overview & Management
                            </h1>
                            <p className="mt-1 text-xs text-indigo-200">
                                Oversee multi-shop operations, shared product catalog, and merchant accounts.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/admin/shops/create"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-indigo-900 shadow-sm transition hover:bg-indigo-50"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>New Shop</span>
                            </Link>
                            <Link
                                href="/admin/products/create"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>New Catalog Product</span>
                            </Link>
                            <Link
                                href="/admin/shop-owners/create"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-700"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>New Shop Owner</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Shops */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Total Registered Shops</span>
                            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                <Store className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                            {stats.total_shops}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                            <span>{stats.active_shops} Active</span>
                            <Link href="/admin/shops" className="font-semibold text-indigo-600 hover:underline">
                                Manage →
                            </Link>
                        </div>
                    </div>

                    {/* Shared Products */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Shared Catalog Products</span>
                            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                <Package className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                            {stats.total_products}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                            <span>{stats.active_products} Active</span>
                            <Link href="/admin/products" className="font-semibold text-emerald-600 hover:underline">
                                Manage →
                            </Link>
                        </div>
                    </div>

                    {/* Shop Owners */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Shop Owner Accounts</span>
                            <div className="rounded-xl bg-violet-50 p-2 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                            {stats.total_shop_owners}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                            <span>Merchant logins</span>
                            <Link href="/admin/shop-owners" className="font-semibold text-violet-600 hover:underline">
                                Manage →
                            </Link>
                        </div>
                    </div>

                    {/* Shop Listings */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Total Shop Assignments</span>
                            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                                <Layers className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                            {stats.total_shop_listings}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                            <span>Products assigned to shops</span>
                            <Link href="/" className="font-semibold text-amber-600 hover:underline">
                                Storefront →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Activities Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Shops */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Store className="h-4 w-4 text-indigo-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Shops</h3>
                            </div>
                            <Link href="/admin/shops" className="text-xs font-semibold text-indigo-600 hover:underline">
                                View all
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                            {recentShops.map((shop) => (
                                <div key={shop.id} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        {shop.logo ? (
                                            <img
                                                src={shop.logo}
                                                alt={shop.name}
                                                className="h-9 w-9 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                                <Store className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                {shop.name}
                                            </h4>
                                            <p className="text-[11px] text-slate-500">
                                                Owner: {shop.owner?.name ?? 'Unassigned'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                            {shop.shop_products_count ?? 0} Products
                                        </span>
                                        <Link
                                            href={`/admin/shops/${shop.id}/edit`}
                                            className="text-xs font-semibold text-slate-600 hover:text-indigo-600"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Products in Shared Catalog */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Recent Catalog Products
                                </h3>
                            </div>
                            <Link href="/admin/products" className="text-xs font-semibold text-emerald-600 hover:underline">
                                View all
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                            {recentProducts.map((p) => (
                                <div key={p.id} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        {p.thumbnail ? (
                                            <img
                                                src={p.thumbnail}
                                                alt={p.name}
                                                className="h-9 w-9 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                                <Package className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                                {p.name}
                                            </h4>
                                            <p className="text-[11px] text-slate-500">
                                                Created by: <strong>{p.creator?.name ?? 'Admin'}</strong> • SKU: {p.sku}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-slate-900 dark:text-white">
                                            ${Number(p.base_price).toFixed(2)}
                                        </span>
                                        <Link
                                            href={`/admin/products/${p.id}/edit`}
                                            className="text-xs font-semibold text-slate-600 hover:text-indigo-600"
                                        >
                                            Edit
                                        </Link>
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

