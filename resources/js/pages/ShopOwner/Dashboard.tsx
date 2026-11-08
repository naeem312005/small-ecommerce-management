import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Edit2,
    ExternalLink,
    Layers,
    Package,
    PackageCheck,
    PackagePlus,
    Plus,
    Store,
} from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Shop, ShopProduct } from '@/types';

type ShopStats = {
    total_products: number;
    active_products: number;
    out_of_stock: number;
};

type Props = {
    shops: Shop[];
    currentShop: Shop | null;
    shopStats: ShopStats | null;
    recentListings: ShopProduct[];
    availableCatalogCount: number;
    myCreatedCatalogProductsCount: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shop Management', href: '/shop-owner/dashboard' },
    { title: 'Dashboard', href: '/shop-owner/dashboard' },
];

export default function ShopOwnerDashboard({
    shops,
    currentShop,
    shopStats,
    recentListings,
    availableCatalogCount,
    myCreatedCatalogProductsCount,
}: Props) {
    if (!currentShop) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Shop Owner Dashboard" />
                <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
                    <Store className="h-16 w-16 text-slate-300 dark:text-slate-700" />
                    <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                        No Shop Assigned Yet
                    </h2>
                    <p className="mt-2 max-w-md text-xs text-slate-500">
                        Your shop owner account is registered, but the system administrator has not assigned a shop to your profile yet.
                    </p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Dashboard - ${currentShop.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header Banner */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            {currentShop.logo ? (
                                <img
                                    src={currentShop.logo}
                                    alt={currentShop.name}
                                    className="h-14 w-14 rounded-2xl object-cover ring-1 ring-border"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Store className="h-7 w-7" />
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                        {currentShop.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#16A34A] dark:border-emerald-800 dark:bg-emerald-950/50">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]"></span>
                                        Active Store
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Manage your shop-specific pricing, custom descriptions, and catalog selections.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <a
                                href={`/shops/${currentShop.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Visit Public Store</span>
                            </a>
                            <Link
                                href="/shop-owner/catalog"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-[#1D4ED8] transition-colors"
                            >
                                <Layers className="h-3.5 w-3.5" />
                                <span>Browse Shared Catalog</span>
                            </Link>
                            <Link
                                href="/shop-owner/catalog/create"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 transition-colors"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Contribute New Product</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Listed in Shop */}
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Products in My Shop</span>
                            <div className="rounded-xl bg-blue-50 p-2 text-primary dark:bg-blue-950/40">
                                <PackageCheck className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
                            {shopStats?.total_products ?? 0}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{shopStats?.active_products ?? 0} Active</span>
                            <Link href="/shop-owner/products" className="font-semibold text-primary hover:underline">
                                View listings →
                            </Link>
                        </div>
                    </div>

                    {/* Shared Catalog available */}
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Available to Add</span>
                            <div className="rounded-xl bg-blue-50 p-2 text-primary dark:bg-blue-950/40">
                                <Layers className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
                            {availableCatalogCount}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>From shared catalog</span>
                            <Link href="/shop-owner/catalog?filter=not_added" className="font-semibold text-primary hover:underline">
                                Browse & Add →
                            </Link>
                        </div>
                    </div>

                    {/* Products Created by Me */}
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Contributed to Catalog</span>
                            <div className="rounded-xl bg-amber-50 p-2 text-[#F59E0B] dark:bg-amber-950/40">
                                <PackagePlus className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
                            {myCreatedCatalogProductsCount}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Authored by you</span>
                            <Link href="/shop-owner/catalog/create" className="font-semibold text-[#F59E0B] hover:underline">
                                Create more →
                            </Link>
                        </div>
                    </div>

                    {/* Out of Stock */}
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Out of Stock Alerts</span>
                            <div className="rounded-xl bg-red-50 p-2 text-[#DC2626] dark:bg-red-950/40">
                                <Package className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
                            {shopStats?.out_of_stock ?? 0}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Needs restock</span>
                            <Link href="/shop-owner/products" className="font-semibold text-[#DC2626] hover:underline">
                                Manage inventory →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Products in this shop */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                            <h3 className="text-sm font-bold tracking-tight text-foreground">
                                Recently Added Shop Listings
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                These products are currently listed in {currentShop.name} with your shop-specific pricing.
                            </p>
                        </div>

                        <Link
                            href="/shop-owner/products"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                            <span>View all ({shopStats?.total_products ?? 0})</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="mt-4 divide-y divide-border">
                        {recentListings.length === 0 ? (
                            <div className="py-8 text-center text-xs text-muted-foreground">
                                You haven't added any products to your shop yet.{' '}
                                <Link href="/shop-owner/catalog" className="font-semibold text-primary hover:underline">
                                    Browse the shared catalog
                                </Link>{' '}
                                to get started!
                            </div>
                        ) : (
                            recentListings.map((item) => {
                                const title = item.display_title || item.product?.name || 'Untitled';
                                const thumbnail = item.display_thumbnail || item.product?.thumbnail;
                                const isCustomPrice =
                                    item.product && Number(item.price) !== Number(item.product.base_price);

                                return (
                                    <div key={item.id} className="flex items-center justify-between py-3.5">
                                        <div className="flex items-center gap-3">
                                            {thumbnail ? (
                                                <img
                                                    src={thumbnail}
                                                    alt={title}
                                                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-border"
                                                />
                                            ) : (
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                                    <Package className="h-5 w-5" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-xs font-bold text-foreground line-clamp-1">
                                                    {title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                    <span>SKU: {item.product?.sku}</span>
                                                    <span>•</span>
                                                    <span>Stock: {item.stock}</span>
                                                    {item.custom_thumbnail && (
                                                        <span className="rounded bg-blue-50 px-1.5 py-0.5 font-semibold text-primary border border-blue-200 dark:bg-blue-950 dark:border-blue-900">
                                                            Custom Image
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className="block text-xs font-bold text-foreground">
                                                    ${Number(item.price).toFixed(2)}
                                                </span>
                                                {isCustomPrice && item.product && (
                                                    <span className="text-[10px] line-through text-muted-foreground">
                                                        Base: ${Number(item.product.base_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            <Link
                                                href={`/shop-owner/products/${item.id}/edit`}
                                                className="inline-flex items-center gap-1 rounded-xl border border-input bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                                            >
                                                <Edit2 className="h-3 w-3" />
                                                <span>Customize</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

