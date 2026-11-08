import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit2,
    Filter,
    Layers,
    Package,
    Plus,
    Search,
    Shield,
    Store,
    Trash2,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
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
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Master Catalog', href: '/admin/products' },
];

export default function AdminProductsIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

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

    const confirmDelete = () => {
        if (deleteProductId) {
            router.delete(`/admin/products/${deleteProductId}`, {
                onSuccess: () => setDeleteProductId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Product Catalog - Admin Panel" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Shared Master Product Catalog (CRUD)
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Central catalog of products authored by administrators and shop owners. Available for all shops to list.
                        </p>
                    </div>

                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add New Master Product</span>
                    </Link>
                </div>

                {/* Filters */}
                <form
                    onSubmit={handleFilter}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by product name, SKU, or creator..."
                            className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded-xl border border-slate-300 py-2 pl-3 pr-8 text-xs dark:border-slate-700 dark:bg-slate-800"
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
                            className="rounded-xl border border-slate-300 py-2 pl-3 pr-8 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                            <option value="">All Statuses</option>
                            <option value="1">Active Only</option>
                            <option value="0">Inactive Only</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600 dark:bg-slate-800"
                        >
                            Filter
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 bg-slate-50 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3 px-4">Master Product</th>
                                <th className="py-3 px-4">Author / Creator</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4 text-right">Base Price</th>
                                <th className="py-3 px-4 text-center">Assigned Shops</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {products.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-500">
                                        No products found in shared catalog.
                                    </td>
                                </tr>
                            ) : (
                                products.data.map((product) => {
                                    const isShopOwnerAuthor = product.creator?.role === 'shop_owner';
                                    const shopsCount = product.shop_products_count ?? 0;

                                    return (
                                        <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    {product.thumbnail ? (
                                                        <img
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                                            <Package className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                                            {product.name}
                                                        </span>
                                                        <span className="block text-[11px] font-mono text-slate-400">
                                                            SKU: {product.sku}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    {isShopOwnerAuthor ? (
                                                        <Store className="h-3.5 w-3.5 text-emerald-600" />
                                                    ) : (
                                                        <Shield className="h-3.5 w-3.5 text-indigo-600" />
                                                    )}
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                        {product.creator?.name ?? 'Admin'}
                                                    </span>
                                                </div>
                                                <span className="block text-[10px] text-slate-400 capitalize">
                                                    {isShopOwnerAuthor ? 'Shop Owner' : 'Administrator'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white">
                                                ${Number(product.base_price).toFixed(2)}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                {shopsCount > 0 ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                        <Store className="h-3 w-3" />
                                                        {shopsCount} {shopsCount === 1 ? 'Shop' : 'Shops'}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400" title="Hidden from customers until a shop assigns it">
                                                        Unassigned (Hidden)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                {product.is_active ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                        <CheckCircle2 className="h-3 w-3" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                                        <XCircle className="h-3 w-3" /> Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        title="Edit Catalog Product"
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteProductId(product.id)}
                                                        title="Delete from Catalog"
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {products.links && products.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-slate-200 p-4 text-xs dark:border-slate-800">
                            <span className="text-slate-500">
                                Showing {products.from ?? 0} to {products.to ?? 0} of {products.total} products
                            </span>
                            <div className="flex items-center gap-1">
                                {products.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : !link.url
                                                  ? 'cursor-not-allowed text-slate-400'
                                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {deleteProductId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Delete Catalog Product
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                            Are you sure you want to remove this product from the master catalog? It will also be unassigned from any shop currently listing it.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteProductId(null)}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
                            >
                                Yes, Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
