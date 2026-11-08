import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit2,
    ExternalLink,
    Filter,
    Layers,
    Package,
    PackagePlus,
    Search,
    Store,
    Trash2,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { sweetAlert } from '@/lib/alert';
import type { BreadcrumbItem, PaginatedData, Shop, ShopProduct } from '@/types';

type Props = {
    shop: Shop;
    shopProducts: PaginatedData<ShopProduct>;
    filters: {
        search?: string;
        status?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shop Management', href: '/shop-owner/dashboard' },
    { title: 'Storefront Inventory', href: '/shop-owner/products' },
];

export default function ShopOwnerProductsIndex({
    shop,
    shopProducts,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/shop-owner/products',
            {
                search: search || undefined,
                status: status || undefined,
            },
            { preserveState: true }
        );
    };

    const handleRemove = async (sp: ShopProduct) => {
        const title = sp.display_title || sp.product?.name || 'this item';
        const confirmed = await sweetAlert.confirm({
            title: `Remove "${title}" from shop?`,
            text: 'This will hide it from your storefront. The master item remains in the shared catalog.',
            confirmButtonText: 'Yes, Remove',
            icon: 'warning',
        });
        if (confirmed) {
            router.delete(`/shop-owner/products/${sp.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`My Shop Products - ${shop.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-foreground">
                                My Shop Product Listings
                            </h1>
                            <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                                {shop.name}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Set custom prices, details, thumbnails, and manage inventory for items listed in your store.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        <Link
                            href="/shop-owner/catalog"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-[#1D4ED8]"
                        >
                            <Layers className="h-4 w-4" />
                            <span>Add from Shared Catalog</span>
                        </Link>
                        <Link
                            href="/shop-owner/catalog/create"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted"
                        >
                            <PackagePlus className="h-4 w-4" />
                            <span>Contribute New Product</span>
                        </Link>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <form
                    onSubmit={handleFilter}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by custom title, product name, or SKU..."
                            className="w-full rounded-xl border border-input bg-background py-2 pl-10 pr-4 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-xl border border-input bg-background py-2 pl-3 pr-8 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">All Availability</option>
                            <option value="1">Available in Shop</option>
                            <option value="0">Hidden / Unavailable</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 shadow-2xs"
                        >
                            Filter
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed text-left text-xs min-w-[760px]">
                            <thead className="border-b border-border bg-muted/50 font-semibold uppercase tracking-wider text-muted-foreground text-[11px]">
                                <tr>
                                    <th className="w-[30%] py-3.5 px-4">Listed Product</th>
                                    <th className="w-[14%] py-3.5 px-4">Catalog SKU</th>
                                    <th className="w-[12%] py-3.5 px-4 text-right">Shop Price</th>
                                    <th className="w-[12%] py-3.5 px-4 text-right">Catalog Base</th>
                                    <th className="w-[9%] py-3.5 px-4 text-center">Stock</th>
                                    <th className="w-[11%] py-3.5 px-4 text-center">Store Status</th>
                                    <th className="w-[12%] py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {shopProducts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-muted-foreground">
                                            No products listed in your shop matching this filter.{' '}
                                            <Link href="/shop-owner/catalog" className="font-semibold text-primary hover:underline">
                                                Browse the shared catalog
                                            </Link>{' '}
                                            to add items.
                                        </td>
                                    </tr>
                                ) : (
                                    shopProducts.data.map((item) => {
                                        const title = item.display_title || item.product?.name || 'Untitled';
                                        const thumbnail = item.display_thumbnail || item.product?.thumbnail;
                                        const isPriceOverridden =
                                            item.product && Number(item.price) !== Number(item.product.base_price);

                                        return (
                                            <tr key={item.id} className="transition-colors hover:bg-muted/40">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {thumbnail ? (
                                                            <img
                                                                src={thumbnail}
                                                                alt={title}
                                                                className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-border shadow-2xs"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <span className="font-bold text-foreground block truncate max-w-[200px]">
                                                                {title}
                                                            </span>
                                                            <div className="flex items-center gap-1.5 text-[10px] whitespace-nowrap">
                                                                {item.custom_title && (
                                                                    <span className="text-primary font-semibold">
                                                                        Custom Title
                                                                    </span>
                                                                )}
                                                                {item.custom_thumbnail && (
                                                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                                                        • Custom Image
                                                                    </span>
                                                                )}
                                                                {item.custom_description && (
                                                                    <span className="text-violet-600 dark:text-violet-400 font-semibold">
                                                                        • Custom Description
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                                                    {item.product?.sku}
                                                </td>
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <span className="font-black text-foreground">
                                                        ${Number(item.price).toFixed(2)}
                                                    </span>
                                                    {isPriceOverridden && (
                                                        <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                            Custom Price
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                                                    ${Number(item.product?.base_price ?? 0).toFixed(2)}
                                                </td>
                                                <td className="py-3.5 px-4 text-center font-bold whitespace-nowrap">
                                                    {item.stock > 0 ? (
                                                        <span className="text-foreground">{item.stock}</span>
                                                    ) : (
                                                        <span className="text-destructive">0</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                    {item.is_available ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                            <CheckCircle2 className="h-3 w-3" /> Live in Store
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-[10px] font-semibold text-destructive border border-destructive/20">
                                                            <XCircle className="h-3 w-3" /> Hidden
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="whitespace-nowrap inline-flex items-center justify-end gap-1.5">
                                                        <a
                                                            href={`/shops/${shop.slug}/products/${item.id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            title="Preview in Storefront"
                                                            className="rounded-xl border border-border bg-card p-2 text-muted-foreground transition hover:border-primary hover:text-primary shadow-2xs"
                                                        >
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </a>
                                                        <Link
                                                            href={`/shop-owner/products/${item.id}/edit`}
                                                            title="Customize Price, Details & Thumbnail"
                                                            className="rounded-xl border border-border bg-card p-2 text-muted-foreground transition hover:border-primary hover:text-primary shadow-2xs"
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemove(item)}
                                                            title="Remove from Shop"
                                                            className="rounded-xl border border-border bg-card p-2 text-muted-foreground transition hover:border-destructive hover:bg-destructive/10 hover:text-destructive shadow-2xs"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {shopProducts.links && shopProducts.links.length > 3 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-border p-4 sm:flex-row text-xs">
                            <span className="text-muted-foreground">
                                Showing {shopProducts.from ?? 0} to {shopProducts.to ?? 0} of {shopProducts.total} shop products
                            </span>
                            <div className="flex items-center gap-1">
                                {shopProducts.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground shadow-xs'
                                                : !link.url
                                                  ? 'cursor-not-allowed text-muted-foreground/40'
                                                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

