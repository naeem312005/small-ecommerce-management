import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit2,
    ExternalLink,
    Filter,
    Plus,
    Search,
    Store,
    Trash2,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Shop } from '@/types';

type Props = {
    shops: PaginatedData<Shop>;
    filters: {
        search?: string;
        status?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Shops Management', href: '/admin/shops' },
];

export default function AdminShopsIndex({ shops, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [deleteShopId, setDeleteShopId] = useState<number | null>(null);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/shops',
            {
                search: search || undefined,
                status: status || undefined,
            },
            { preserveState: true }
        );
    };

    const confirmDelete = () => {
        if (deleteShopId) {
            router.delete(`/admin/shops/${deleteShopId}`, {
                onSuccess: () => setDeleteShopId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shops Management - Admin Panel" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Shop Management (CRUD)
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Create, configure, and assign shops to shop owner merchant accounts.
                        </p>
                    </div>

                    <Link
                        href="/admin/shops/create"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create New Shop</span>
                    </Link>
                </div>

                {/* Filter and Search Bar */}
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
                            placeholder="Search by shop name, email, phone, or owner..."
                            className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>

                    <div className="flex items-center gap-2">
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
                                <th className="py-3 px-4">Shop</th>
                                <th className="py-3 px-4">Shop Owner</th>
                                <th className="py-3 px-4">Contact & Location</th>
                                <th className="py-3 px-4 text-center">Assigned Items</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {shops.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        No shops found.
                                    </td>
                                </tr>
                            ) : (
                                shops.data.map((shop) => (
                                    <tr key={shop.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                {shop.logo ? (
                                                    <img
                                                        src={shop.logo}
                                                        alt={shop.name}
                                                        className="h-10 w-10 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                                                        <Store className="h-5 w-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        {shop.name}
                                                    </span>
                                                    <span className="block text-[11px] font-mono text-slate-400">
                                                        /shops/{shop.slug}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {shop.owner ? (
                                                <div>
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                        {shop.owner.name}
                                                    </span>
                                                    <span className="block text-[11px] text-slate-400">
                                                        {shop.owner.email}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-amber-600 italic">No Owner Assigned</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                                            <div>{shop.address || '—'}</div>
                                            <div className="text-[11px] text-slate-400">{shop.phone || shop.email || '—'}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                                {shop.shop_products_count ?? 0}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            {shop.is_active ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                    <CheckCircle2 className="h-3 w-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                                    <XCircle className="h-3 w-3" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={`/shops/${shop.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="Visit Customer Storefront"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                                <Link
                                                    href={`/admin/shops/${shop.id}/edit`}
                                                    title="Edit Shop"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteShopId(shop.id)}
                                                    title="Delete Shop"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {shops.links && shops.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-slate-200 p-4 text-xs dark:border-slate-800">
                            <span className="text-slate-500">
                                Showing {shops.from ?? 0} to {shops.to ?? 0} of {shops.total} shops
                            </span>
                            <div className="flex items-center gap-1">
                                {shops.links.map((link, idx) => (
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
            {deleteShopId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Shop</h3>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                            Are you sure you want to delete this shop? All shop-specific listings will be removed. The master products will remain in the shared catalog.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteShopId(null)}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
                            >
                                Yes, Delete Shop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
