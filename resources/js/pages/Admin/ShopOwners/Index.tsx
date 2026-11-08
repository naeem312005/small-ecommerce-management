import { Head, Link, router } from '@inertiajs/react';
import {
    Edit2,
    Mail,
    Phone,
    Plus,
    Search,
    Store,
    Trash2,
    User as UserIcon,
    Users,
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
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Shop Owners', href: '/admin/shop-owners' },
];

export default function AdminShopOwnersIndex({ shopOwners, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteOwnerId, setDeleteOwnerId] = useState<number | null>(null);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/shop-owners', { search }, { preserveState: true });
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
            <Head title="Shop Owner Accounts - Admin Panel" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Shop Owner Accounts (CRUD)
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Create and manage accounts for merchant shop owners who operate stores on the platform.
                        </p>
                    </div>

                    <Link
                        href="/admin/shop-owners/create"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create Shop Owner Account</span>
                    </Link>
                </div>

                {/* Search */}
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
                            placeholder="Search by owner name, email, or phone..."
                            className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>

                    <button
                        type="submit"
                        className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600 dark:bg-slate-800"
                    >
                        Search
                    </button>
                </form>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 bg-slate-50 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3 px-4">Merchant Name</th>
                                <th className="py-3 px-4">Email Address</th>
                                <th className="py-3 px-4">Phone</th>
                                <th className="py-3 px-4">Assigned Shops</th>
                                <th className="py-3 px-4">Registered Date</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {shopOwners.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        No shop owners found.
                                    </td>
                                </tr>
                            ) : (
                                shopOwners.data.map((owner) => (
                                    <tr key={owner.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-950 dark:text-indigo-300">
                                                    {owner.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {owner.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                                            {owner.email}
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                                            {owner.phone || '—'}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {owner.shops && owner.shops.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {owner.shops.map((s) => (
                                                        <span
                                                            key={s.id}
                                                            className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                        >
                                                            <Store className="h-3 w-3" />
                                                            {s.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-amber-600 italic">
                                                    No shop assigned yet
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                                            {owner.created_at ? new Date(owner.created_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/shop-owners/${owner.id}/edit`}
                                                    title="Edit Account"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteOwnerId(owner.id)}
                                                    title="Delete Account"
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
                    {shopOwners.links && shopOwners.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-slate-200 p-4 text-xs dark:border-slate-800">
                            <span className="text-slate-500">
                                Showing {shopOwners.from ?? 0} to {shopOwners.to ?? 0} of {shopOwners.total} shop owners
                            </span>
                            <div className="flex items-center gap-1">
                                {shopOwners.links.map((link, idx) => (
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
            {deleteOwnerId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Delete Shop Owner Account
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                            Are you sure you want to delete this shop owner account? Any shops assigned to this owner will also be removed.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
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
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
                            >
                                Yes, Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

