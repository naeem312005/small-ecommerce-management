import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Layers,
    Package,
    Plus,
    Shield,
    Store,
    Tag,
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
    total_categories?: number;
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
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Platform Overview — Admin Console" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Welcome / Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-6 sm:p-8 shadow-xl">
                    <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                                <Shield className="h-3.5 w-3.5" />
                                <span>Platform Administration</span>
                            </div>
                            <h1 className="mt-3 font-serif text-2xl font-black tracking-tight sm:text-3xl">
                                Velora Marketplace Console
                            </h1>
                            <p className="mt-1 text-xs opacity-80 max-w-xl">
                                Real-time oversight across independent storefronts, central catalog distribution, and merchant accounts.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href="/admin/shops/create"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-background px-4 py-2.5 text-xs font-bold text-foreground shadow-md transition hover:bg-background/90"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>New Shop</span>
                            </Link>
                            <Link
                                href="/admin/products/create"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-white/30 backdrop-blur-xs"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>New Product</span>
                            </Link>
                            <Link
                                href="/admin/categories"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
                            >
                                <Tag className="h-3.5 w-3.5" />
                                <span>Categories ({stats.total_categories ?? 6})</span>
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
                    <div className="group rounded-3xl border border-border bg-card p-5 shadow-xs transition hover:border-border/80 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Merchant Shops
                            </span>
                            <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                <Store className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-black text-foreground">
                            {stats.total_shops}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {stats.active_shops} Active Stores
                            </span>
                            <Link
                                href="/admin/shops"
                                className="font-bold text-primary hover:underline"
                            >
                                Manage →
                            </Link>
                        </div>
                    </div>

                    {/* Shared Products */}
                    <div className="group rounded-3xl border border-border bg-card p-5 shadow-xs transition hover:border-border/80 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Catalog Products
                            </span>
                            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                <Package className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-black text-foreground">
                            {stats.total_products}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
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
                    <div className="group rounded-3xl border border-border bg-card p-5 shadow-xs transition hover:border-border/80 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Merchant Accounts
                            </span>
                            <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-black text-foreground">
                            {stats.total_shop_owners}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                            <span className="text-muted-foreground">Verified Operators</span>
                            <Link
                                href="/admin/shop-owners"
                                className="font-bold text-primary hover:underline"
                            >
                                Manage →
                            </Link>
                        </div>
                    </div>

                    {/* Shop Listings */}
                    <div className="group rounded-3xl border border-border bg-card p-5 shadow-xs transition hover:border-border/80 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Active Store Listings
                            </span>
                            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                <Layers className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-black text-foreground">
                            {stats.total_shop_listings}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                            <span className="text-muted-foreground">Assigned to Stores</span>
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
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-border/60 pb-4">
                            <div className="flex items-center gap-2">
                                <Store className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-bold text-foreground">
                                    Recent Merchant Shops
                                </h3>
                            </div>
                            <Link
                                href="/admin/shops"
                                className="text-xs font-bold text-primary hover:underline"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-border/60">
                            {recentShops.map((shop) => (
                                <div
                                    key={shop.id}
                                    className="flex items-center justify-between py-3.5"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {shop.logo ? (
                                            <img
                                                src={shop.logo}
                                                alt={shop.name}
                                                className="h-10 w-10 shrink-0 rounded-2xl object-cover ring-1 ring-border shadow-2xs"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white font-bold shadow-2xs">
                                                <Store className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-foreground truncate max-w-[180px]">
                                                {shop.name}
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                                                {shop.owner ? `Owned by ${shop.owner.name}` : 'Unassigned'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs shrink-0">
                                        <span className="whitespace-nowrap rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground border border-border/60 shadow-2xs">
                                            {shop.shop_products_count ?? 0} Listed
                                        </span>
                                        <a
                                            href={`/shops/${shop.slug}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        >
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-border/60 pb-4">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <h3 className="text-sm font-bold text-foreground">
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

                        <div className="mt-4 divide-y divide-border/60">
                            {recentProducts.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="flex items-center justify-between py-3.5"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {prod.thumbnail ? (
                                            <img
                                                src={prod.thumbnail}
                                                alt={prod.name}
                                                className="h-10 w-10 shrink-0 rounded-2xl object-cover ring-1 ring-border shadow-2xs"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                                <Package className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-foreground truncate max-w-[180px]">
                                                {prod.name}
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                                                {prod.category} • SKU: {prod.sku}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-xs font-black text-foreground whitespace-nowrap">
                                            ${Number(prod.base_price).toFixed(2)}
                                        </span>
                                        <span className="block text-[10px] text-muted-foreground">MSRP</span>
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
