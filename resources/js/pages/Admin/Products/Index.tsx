import { Head, Link, router } from '@inertiajs/react';
import {
    Edit3,
    Package,
    Plus,
    Search,
    Shield,
    Store,
    Trash2,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { sweetAlert } from '@/lib/alert';
import type { BreadcrumbItem, PaginatedData, Product } from '@/types';

type Props = {
    products: PaginatedData<Product>;
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin/dashboard' },
    { title: 'Master Catalog', href: '/admin/products' },
];

export default function AdminProductsIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/products',
            {
                search: search || undefined,
                category: category || undefined,
                status: status || undefined,
            },
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setStatus('');
        router.get('/admin/products');
    };

    const handleDelete = async (product: Product) => {
        const confirmed = await sweetAlert.confirmDelete(`product "${product.name}"`);
        if (confirmed) {
            router.delete(`/admin/products/${product.id}`);
        }
    };

    const hasFilters = Boolean(filters.search || filters.category || filters.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Product Catalog — Admin Console" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Master Product Catalog
                            </h1>
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                                {products.total} Products
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Shared master catalog of items authored by platform admins and merchant partners for multi-vendor distribution.
                        </p>
                    </div>

                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Master Product</span>
                    </Link>
                </div>

                {/* Filters */}
                <form
                    onSubmit={handleFilter}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, SKU, brand, or description..."
                            className="w-full rounded-xl border border-input bg-background py-2 pl-10 pr-4 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded-xl border border-input bg-background py-2 pl-3 pr-8 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-xl border border-input bg-background py-2 pl-3 pr-8 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">All Statuses</option>
                            <option value="1">Active Only</option>
                            <option value="0">Archived Only</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:opacity-90 shadow-2xs"
                        >
                            Filter
                        </button>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-xl border border-border bg-background p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs"
                                title="Clear filters"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Table Card */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed text-left text-xs min-w-[700px]">
                            <thead className="border-b border-border bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="w-[26%] py-3.5 px-4">Product Details</th>
                                    <th className="w-[17%] py-3.5 px-4">Author / Origin</th>
                                    <th className="w-[13%] py-3.5 px-4">Category</th>
                                    <th className="w-[11%] py-3.5 px-4 text-right">Base MSRP</th>
                                    <th className="w-[12%] py-3.5 px-4 text-center">Store Distribution</th>
                                    <th className="w-[9%] py-3.5 px-4 text-center">Catalog Status</th>
                                    <th className="w-[12%] py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            <Package className="mx-auto h-8 w-8 text-muted-foreground/60" />
                                            <p className="mt-2 text-sm font-bold text-foreground">
                                                No catalog products match your search
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product) => {
                                        const isShopOwnerAuthor = product.creator?.role === 'shop_owner';
                                        const shopsCount = product.shop_products_count ?? 0;

                                        return (
                                            <tr
                                                key={product.id}
                                                className="transition-colors hover:bg-muted/40"
                                            >
                                                {/* Product */}
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-3.5">
                                                        {product.thumbnail ? (
                                                            <img
                                                                src={product.thumbnail}
                                                                alt={product.name}
                                                                className="h-11 w-11 shrink-0 rounded-2xl object-cover ring-1 ring-border shadow-2xs"
                                                            />
                                                        ) : (
                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <span className="font-bold text-foreground block truncate max-w-[220px]">
                                                                {product.name}
                                                            </span>
                                                            <span className="mt-0.5 inline-block font-mono text-[10px] font-semibold text-muted-foreground whitespace-nowrap">
                                                                SKU: {product.sku}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Author */}
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div
                                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white font-bold text-[10px] shadow-2xs ${
                                                                isShopOwnerAuthor
                                                                    ? 'bg-emerald-600'
                                                                    : 'bg-indigo-600'
                                                            }`}
                                                        >
                                                            {isShopOwnerAuthor ? (
                                                                <Store className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <Shield className="h-3.5 w-3.5" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className="font-semibold text-foreground block truncate max-w-[130px]">
                                                                {product.creator?.name ?? 'Platform Admin'}
                                                            </span>
                                                            <span className="block text-[10px] text-muted-foreground whitespace-nowrap">
                                                                {isShopOwnerAuthor
                                                                    ? 'Merchant Author'
                                                                    : 'Administrator'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Category */}
                                                <td className="py-4 px-5">
                                                    <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-foreground border border-border/60 whitespace-nowrap">
                                                        {product.category || 'General'}
                                                    </span>
                                                </td>

                                                {/* Base Price */}
                                                <td className="py-4 px-5 text-right font-black text-foreground text-sm whitespace-nowrap">
                                                    ${Number(product.base_price).toFixed(2)}
                                                </td>

                                                {/* Distribution */}
                                                <td className="py-4 px-5 text-center">
                                                    {shopsCount > 0 ? (
                                                        <span className="whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                            <Store className="h-3 w-3" />
                                                            Listed in {shopsCount}{' '}
                                                            {shopsCount === 1 ? 'Shop' : 'Shops'}
                                                        </span>
                                                    ) : (
                                                        <span className="whitespace-nowrap inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                            Unassigned (Isolated)
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-5 text-center">
                                                    {product.is_active ? (
                                                        <span className="whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground border border-border">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                                            Archived
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-5 text-right">
                                                    <div className="whitespace-nowrap inline-flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={`/admin/products/${product.id}/edit`}
                                                            title="Edit Master Product"
                                                            className="rounded-xl border border-border bg-card p-2 text-muted-foreground transition hover:border-primary hover:text-primary shadow-2xs"
                                                        >
                                                            <Edit3 className="h-3.5 w-3.5" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(product)}
                                                            title="Delete Product"
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
                    {products.links && products.links.length > 3 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-border p-4 sm:flex-row text-xs">
                            <span className="text-muted-foreground">
                                Showing {products.from ?? 0} to {products.to ?? 0} of {products.total} products
                            </span>
                            <div className="flex items-center gap-1">
                                {products.links.map((link, idx) => (
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
