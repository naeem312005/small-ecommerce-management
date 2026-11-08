import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    Edit3,
    ExternalLink,
    Filter,
    MapPin,
    Package,
    Phone,
    Plus,
    Search,
    Store,
    Trash2,
    User as UserIcon,
    X,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { sweetAlert } from '@/lib/alert';
import type { BreadcrumbItem, PaginatedData, Shop } from '@/types';

type Props = {
    shops: PaginatedData<Shop>;
    filters: {
        search?: string;
        status?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin/dashboard' },
    { title: 'Merchant Shops', href: '/admin/shops' },
];

export default function AdminShopsIndex({ shops, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

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

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        router.get('/admin/shops');
    };

    const handleDelete = async (shop: Shop) => {
        const confirmed = await sweetAlert.confirmDelete(`shop "${shop.name}"`);
        if (confirmed) {
            router.delete(`/admin/shops/${shop.id}`);
        }
    };

    const hasFilters = Boolean(filters.search || filters.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Merchant Shops — Admin Console" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Merchant Shops
                            </h1>
                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                {shops.total} Registered
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Configure active storefronts, assign merchant owners, and monitor shop-specific inventory.
                        </p>
                    </div>

                    <Link
                        href="/admin/shops/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create New Shop</span>
                    </Link>
                </div>

                {/* Filter and Search Bar */}
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
                            placeholder="Search by shop name, owner, city, or email..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-2">
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

                {/* Modern Table Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                <tr>
                                    <th className="py-3.5 px-5">Shop Profile</th>
                                    <th className="py-3.5 px-5">Merchant Owner</th>
                                    <th className="py-3.5 px-5">Contact & Location</th>
                                    <th className="py-3.5 px-5 text-center">Assigned Catalog Items</th>
                                    <th className="py-3.5 px-5 text-center">Status</th>
                                    <th className="py-3.5 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {shops.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-500">
                                            <Store className="mx-auto h-8 w-8 text-slate-400" />
                                            <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                                No shops match your query
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Try adjusting search parameters or create a new storefront.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    shops.data.map((shop) => (
                                        <tr
                                            key={shop.id}
                                            className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                        >
                                            {/* Shop Profile */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3.5">
                                                    {shop.logo ? (
                                                        <img
                                                            src={shop.logo}
                                                            alt={shop.name}
                                                            className="h-11 w-11 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                                        />
                                                    ) : (
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white shadow-xs">
                                                            <Store className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-bold text-slate-900 dark:text-white">
                                                            {shop.name}
                                                        </span>
                                                        <a
                                                            href={`/shops/${shop.slug}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="group mt-0.5 flex items-center gap-1 font-mono text-[11px] text-indigo-600 hover:underline dark:text-indigo-400"
                                                        >
                                                            <span>/shops/{shop.slug}</span>
                                                            <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Owner */}
                                            <td className="py-4 px-5">
                                                {shop.owner ? (
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            {shop.owner.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                                {shop.owner.name}
                                                            </span>
                                                            <span className="block text-[11px] text-slate-400">
                                                                {shop.owner.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>

                                            {/* Location & Contact */}
                                            <td className="py-4 px-5 text-slate-600 dark:text-slate-400">
                                                {shop.address && (
                                                    <div className="flex items-center gap-1.5 truncate max-w-xs">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                        <span className="truncate">{shop.address}</span>
                                                    </div>
                                                )}
                                                {(shop.phone || shop.email) && (
                                                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                                                        <Phone className="h-3 w-3 shrink-0" />
                                                        <span>{shop.phone || shop.email}</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Assigned Items */}
                                            <td className="py-4 px-5 text-center">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                                    <Package className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                                    <span>{shop.shop_products_count ?? 0} Listed</span>
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-5 text-center">
                                                {shop.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <a
                                                        href={`/shops/${shop.slug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="View Live Storefront"
                                                        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
                                                    <Link
                                                        href={`/admin/shops/${shop.id}/edit`}
                                                        title="Edit Shop Details"
                                                        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(shop)}
                                                        title="Delete Shop"
                                                        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-rose-900 dark:hover:bg-rose-950 dark:hover:text-rose-400"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {shops.links && shops.links.length > 3 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 p-4 sm:flex-row dark:border-slate-800 text-xs">
                            <span className="text-slate-500">
                                Showing {shops.from ?? 0} to {shops.to ?? 0} of {shops.total} shops
                            </span>
                            <div className="flex items-center gap-1">
                                {shops.links.map((link, idx) => (
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
