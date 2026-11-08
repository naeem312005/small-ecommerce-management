import { Head, Link, router } from '@inertiajs/react';
import {
    Edit3,
    ExternalLink,
    Mail,
    Phone,
    Plus,
    Search,
    Store,
    Trash2,
    User as UserIcon,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, User } from '@/types';

type Props = {
    shopOwners: PaginatedData<User>;
    filters: {
        search?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin/dashboard' },
    { title: 'Merchant Accounts', href: '/admin/shop-owners' },
];

export default function AdminShopOwnersIndex({ shopOwners, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteOwnerId, setDeleteOwnerId] = useState<number | null>(null);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/shop-owners', { search: search || undefined }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        router.get('/admin/shop-owners');
    };

    const confirmDelete = () => {
        if (deleteOwnerId) {
            router.delete(`/admin/shop-owners/${deleteOwnerId}`, {
                onSuccess: () => setDeleteOwnerId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Merchant Accounts — Admin Console" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Merchant Accounts
                            </h1>
                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                {shopOwners.total} Merchants
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Manage merchant credentials, contact records, and storefront ownership assignments.
                        </p>
                    </div>

                    <Link
                        href="/admin/shop-owners/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Register Merchant</span>
                    </Link>
                </div>

                {/* Search */}
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
                            placeholder="Search by merchant name, email, or telephone..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600"
                        >
                            Search
                        </button>

                        {filters.search && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800"
                                title="Clear search"
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
                                    <th className="py-3.5 px-5">Merchant Profile</th>
                                    <th className="py-3.5 px-5">Contact Details</th>
                                    <th className="py-3.5 px-5">Assigned Storefront</th>
                                    <th className="py-3.5 px-5">Registered Date</th>
                                    <th className="py-3.5 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {shopOwners.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500">
                                            <Users className="mx-auto h-8 w-8 text-slate-400" />
                                            <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                                No merchant accounts found
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    shopOwners.data.map((owner) => {
                                        const assignedShop = owner.shops?.[0];

                                        return (
                                            <tr
                                                key={owner.id}
                                                className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                            >
                                                {/* Profile */}
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-900 to-indigo-600 font-bold text-white shadow-xs">
                                                            {owner.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-slate-900 dark:text-white">
                                                                {owner.name}
                                                            </span>
                                                            <span className="block text-[11px] text-slate-400">
                                                                ID: #{owner.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className="py-4 px-5">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                            <span>{owner.email}</span>
                                                        </div>
                                                        {owner.phone && (
                                                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                                                                <Phone className="h-3 w-3" />
                                                                <span>{owner.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Assigned Storefront */}
                                                <td className="py-4 px-5">
                                                    {assignedShop ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                                <Store className="h-3.5 w-3.5" />
                                                            </div>
                                                            <div>
                                                                <Link
                                                                    href={`/admin/shops/${assignedShop.id}/edit`}
                                                                    className="font-bold text-slate-900 hover:text-indigo-600 dark:text-white"
                                                                >
                                                                    {assignedShop.name}
                                                                </Link>
                                                                <a
                                                                    href={`/shops/${assignedShop.slug}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="block text-[10px] text-indigo-600 hover:underline dark:text-indigo-400 font-mono"
                                                                >
                                                                    /shops/{assignedShop.slug}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                                            No Store Assigned
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Registered Date */}
                                                <td className="py-4 px-5 text-slate-500 text-xs">
                                                    {owner.created_at
                                                        ? new Date(owner.created_at).toLocaleDateString(
                                                              'en-US',
                                                              {
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  year: 'numeric',
                                                              }
                                                          )
                                                        : '—'}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-5 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={`/admin/shop-owners/${owner.id}/edit`}
                                                            title="Edit Merchant"
                                                            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                                        >
                                                            <Edit3 className="h-3.5 w-3.5" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteOwnerId(owner.id)}
                                                            title="Delete Merchant"
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
                    {shopOwners.links && shopOwners.links.length > 3 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 p-4 sm:flex-row dark:border-slate-800 text-xs">
                            <span className="text-slate-500">
                                Showing {shopOwners.from ?? 0} to {shopOwners.to ?? 0} of{' '}
                                {shopOwners.total} merchants
                            </span>
                            <div className="flex items-center gap-1">
                                {shopOwners.links.map((link, idx) => (
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

            {/* Delete Modal */}
            {deleteOwnerId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Delete Merchant Account?
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                            Are you sure you want to delete this merchant account? If this merchant owns any active shops, the shops will become unassigned.
                        </p>
                        <div className="mt-6 flex justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setDeleteOwnerId(null)}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-500"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
