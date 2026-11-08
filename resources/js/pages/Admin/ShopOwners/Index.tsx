import { Head, Link, router } from '@inertiajs/react';
import {
    Edit3,
    Mail,
    Phone,
    Plus,
    Search,
    Store,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { sweetAlert } from '@/lib/alert';
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

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/shop-owners', { search: search || undefined }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        router.get('/admin/shop-owners');
    };

    const handleDelete = async (owner: User) => {
        const confirmed = await sweetAlert.confirmDelete(`merchant "${owner.name}"`);
        if (confirmed) {
            router.delete(`/admin/shop-owners/${owner.id}`);
        }
    };

    const hasFilters = Boolean(filters.search);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Merchant Accounts — Admin Console" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Merchant Accounts
                            </h1>
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                                {shopOwners.total} Merchants
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Manage merchant credentials, contact records, and storefront ownership assignments.
                        </p>
                    </div>

                    <Link
                        href="/admin/shop-owners/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Register Merchant</span>
                    </Link>
                </div>

                {/* Search */}
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
                            placeholder="Search by merchant name, email, or telephone..."
                            className="w-full rounded-xl border border-input bg-background py-2 pl-10 pr-4 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:opacity-90 shadow-2xs"
                        >
                            Search
                        </button>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-xl border border-border bg-background p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs"
                                title="Clear search"
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
                                    <th className="w-[27%] py-3.5 px-4">Merchant Profile</th>
                                    <th className="w-[24%] py-3.5 px-4">Contact Details</th>
                                    <th className="w-[24%] py-3.5 px-4">Assigned Storefront</th>
                                    <th className="w-[13%] py-3.5 px-4">Registered Date</th>
                                    <th className="w-[12%] py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {shopOwners.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                            <Users className="mx-auto h-8 w-8 text-muted-foreground/60" />
                                            <p className="mt-2 text-sm font-bold text-foreground">
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
                                                className="transition-colors hover:bg-muted/40"
                                            >
                                                {/* Profile */}
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-xs text-primary ring-1 ring-primary/20">
                                                            {owner.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className="font-bold text-foreground block truncate max-w-[180px]">
                                                                {owner.name}
                                                            </span>
                                                            <span className="block text-[11px] text-muted-foreground whitespace-nowrap">
                                                                ID: #{owner.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className="py-4 px-5">
                                                    <div className="space-y-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 text-foreground/80 truncate max-w-[220px]">
                                                            <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                            <span className="truncate">{owner.email}</span>
                                                        </div>
                                                        {owner.phone && (
                                                            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] whitespace-nowrap">
                                                                <Phone className="h-3 w-3 shrink-0" />
                                                                <span>{owner.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Assigned Storefront */}
                                                <td className="py-4 px-5">
                                                    {assignedShop ? (
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                                <Store className="h-4 w-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <Link
                                                                    href={`/admin/shops/${assignedShop.id}/edit`}
                                                                    className="font-bold text-foreground hover:text-primary transition-colors block truncate max-w-[150px]"
                                                                >
                                                                    {assignedShop.name}
                                                                </Link>
                                                                <a
                                                                    href={`/shops/${assignedShop.slug}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="block text-[10px] text-indigo-600 hover:underline dark:text-indigo-400 font-mono whitespace-nowrap"
                                                                >
                                                                    /shops/{assignedShop.slug}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="whitespace-nowrap inline-flex items-center rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                            No Store Assigned
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Registered Date */}
                                                <td className="py-4 px-5 text-muted-foreground text-xs whitespace-nowrap">
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
                                                    <div className="whitespace-nowrap inline-flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={`/admin/shop-owners/${owner.id}/edit`}
                                                            title="Edit Merchant"
                                                            className="rounded-xl border border-border bg-card p-2 text-muted-foreground transition hover:border-primary hover:text-primary shadow-2xs"
                                                        >
                                                            <Edit3 className="h-3.5 w-3.5" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(owner)}
                                                            title="Delete Merchant"
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
                    {shopOwners.links && shopOwners.links.length > 3 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-border p-4 sm:flex-row text-xs">
                            <span className="text-muted-foreground">
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
