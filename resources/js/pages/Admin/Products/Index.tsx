import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit3,
    Filter,
    Layers,
    Package,
    Plus,
    Search,
    Shield,
    Store,
    Trash2,
    X,
    XCircle,
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
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Master Product Catalog
                            </h1>
                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                {products.total} Products
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Shared master catalog of items authored by platform admins and merchant partners for multi-vendor distribution.
                        </p>
                    </div>

                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Master Product</span>
                    </Link>
                </div>

                {/* Filters */}
                <form
                    onSubmit={handleFilter}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by product name, SKU code, or author..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-3 pr-8 text-xs text-slate-700 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
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
                            className="rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-3 pr-8 text-xs text-slate-700 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                        >
                            <option value="">All Statuses</option>
                            <option value="1">Active Only</option>
                            <option value="0">Inactive Only</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600"
                        >
                            Filter
                        </button>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800"
                                title="Clear filters"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Table Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                <tr>
                                    <th className="py-3.5 px-5">Product Details</th>
                                    <th className="py-3.5 px-5">Author / Origin</th>
                                    <th className="py-3.5 px-5">Category</th>
                                    <th className="py-3.5 px-5 text-right">Base MSRP</th>
                                    <th className="py-3.5 px-5 text-center">Store Distribution</th>
                                    <th className="py-3.5 px-5 text-center">Catalog Status</th>
                                    <th className="py-3.5 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-500">
                                            <Package className="mx-auto h-8 w-8 text-slate-400" />
                                            <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">
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
                                                className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                            >
                                                {/* Product */}
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-3.5">
                                                        {product.thumbnail ? (
                                                            <img
                                                                src={product.thumbnail}
                                                                alt={product.name}
                                                                className="h-11 w-11 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                                            />
                                                        ) : (
                                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <span className="font-bold text-slate-900 line-clamp-1 dark:text-white">
                                                                {product.name}
                                                            </span>
                                                            <span className="mt-0.5 inline-block font-mono text-[10px] font-semibold text-slate-500">
                                                                SKU: {product.sku}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Author */}
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-white font-bold text-[10px] ${
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
                                                        <div>
                                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                                {product.creator?.name ?? 'Platform Admin'}
                                                            </span>
                                                            <span className="block text-[10px] text-slate-400">
                                                                {isShopOwnerAuthor
                                                                    ? 'Merchant Author'
                                                                    : 'Administrator'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Category */}
                                                <td className="py-4 px-5">
                                                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {product.category || 'General'}
                                                    </span>
                                                </td>

                                                {/* Base Price */}
                                                <td className="py-4 px-5 text-right font-black text-slate-900 dark:text-white text-sm">
                                                    ${Number(product.base_price).toFixed(2)}
                                                </td>

                                                {/* Distribution */}
                                                <td className="py-4 px-5 text-center">
                                                    {shopsCount > 0 ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                            <Store className="h-3 w-3" />
                                                            Listed in {shopsCount}{' '}
                                                            {shopsCount === 1 ? 'Shop' : 'Shops'}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                                            Unassigned (Isolated)
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-5 text-center">
                                                    {product.is_active ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                            Archived
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-5 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={`/admin/products/${product.id}/edit`}
                                                            title="Edit Master Product"
                                                            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                                        >
                                                            <Edit3 className="h-3.5 w-3.5" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(product)}
                                                            title="Delete Product"
                                                            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-rose-900 dark:hover:bg-rose-950 dark:hover:text-rose-400"
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
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 p-4 sm:flex-row dark:border-slate-800 text-xs">
                            <span className="text-slate-500">
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
                                                ? 'bg-indigo-600 text-white shadow-xs'
                                                : !link.url
                                                  ? 'cursor-not-allowed text-slate-300 dark:text-slate-700'
                                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
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
