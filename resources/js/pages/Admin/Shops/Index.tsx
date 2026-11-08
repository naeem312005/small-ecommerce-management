import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpRight,
    Edit3,
    ExternalLink,
    MapPin,
    Package,
    Phone,
    Plus,
    Search,
    Store,
    Trash2,
    X,
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
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Merchant Shops
                            </h1>
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                                {shops.total} Registered
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Configure active storefronts, assign merchant owners, and monitor shop-specific inventory.
                        </p>
                    </div>

                    <Link
                        href="/admin/shops/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create New Shop</span>
                    </Link>
                </div>

                {/* Filter and Search Bar */}
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
                            placeholder="Search by shop name, owner, city, or email..."
                            className="w-full rounded-xl border border-input bg-background py-2 pl-10 pr-4 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-xl border border-input bg-background py-2 pl-3 pr-8 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">All Statuses</option>
                            <option value="1">Active Only</option>
                            <option value="0">Inactive Only</option>
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

                {/* Modern Table Card with Robust Widths */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed text-left text-xs min-w-[700px]">
                            <thead className="border-b border-border bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="w-[26%] py-3.5 px-4">Shop Profile</th>
                                    <th className="w-[19%] py-3.5 px-4">Merchant Owner</th>
                                    <th className="w-[20%] py-3.5 px-4">Contact & Location</th>
                                    <th className="w-[12%] py-3.5 px-4 text-center">Assigned Items</th>
                                    <th className="w-[10%] py-3.5 px-4 text-center">Status</th>
                                    <th className="w-[13%] py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {shops.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                            <Store className="mx-auto h-8 w-8 text-muted-foreground/60" />
                                            <p className="mt-2 text-sm font-bold text-foreground">
                                                No shops match your query
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Try adjusting search parameters or create a new storefront.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    shops.data.map((shop) => (
                                        <tr
                                            key={shop.id}
                                            className="transition-colors hover:bg-muted/40"
                                        >
                                            {/* Shop Profile */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    {shop.logo ? (
                                                        <img
                                                            src={shop.logo}
                                                            alt={shop.name}
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                                if (fallback) fallback.style.display = 'flex';
                                                            }}
                                                            className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-border shadow-2xs"
                                                        />
                                                    ) : null}
                                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-white shadow-2xs ${shop.logo ? 'hidden' : 'flex'}`}>
                                                        <Store className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-foreground text-sm truncate max-w-[180px]">
                                                            {shop.name}
                                                        </div>
                                                        <a
                                                            href={`/shops/${shop.slug}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline whitespace-nowrap"
                                                        >
                                                            <span>/shops/{shop.slug}</span>
                                                            <ArrowUpRight className="h-3 w-3 shrink-0 opacity-70" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Owner */}
                                            <td className="py-4 px-4">
                                                {shop.owner ? (
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-xs text-primary ring-1 ring-primary/20">
                                                            {(shop.owner.name || '??').substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-foreground whitespace-nowrap truncate max-w-[140px]">
                                                                {shop.owner.name || 'Unnamed'}
                                                            </div>
                                                            <div className="text-[11px] text-muted-foreground whitespace-nowrap truncate max-w-[140px]">
                                                                {shop.owner.email || 'No email'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="rounded-lg bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>

                                            {/* Location & Contact */}
                                            <td className="py-4 px-4">
                                                <div className="min-w-0 max-w-[200px]">
                                                    {shop.address ? (
                                                        <div className="flex items-center gap-1.5 text-foreground/80 truncate">
                                                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                            <span className="truncate">{shop.address}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground italic text-[11px]">No address</span>
                                                    )}
                                                    {(shop.phone || shop.email) && (
                                                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground whitespace-nowrap">
                                                            <Phone className="h-3 w-3 shrink-0" />
                                                            <span>{shop.phone || shop.email}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Assigned Items */}
                                            <td className="py-4 px-4 text-center">
                                                <span className="whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-semibold text-secondary-foreground border border-border/60 shadow-2xs">
                                                    <Package className="h-3.5 w-3.5 text-primary shrink-0" />
                                                    <span>{shop.shop_products_count ?? 0} Listed</span>
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4 text-center">
                                                {shop.is_active ? (
                                                    <span className="whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground border border-border">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-5 text-right">
                                                <div className="whitespace-nowrap inline-flex items-center justify-end gap-1.5">
                                                    <a
                                                        href={`/shops/${shop.slug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="View Live Storefront"
                                                        className="rounded-xl border border-border bg-card p-2 text-muted-foreground transition hover:border-primary hover:text-primary shadow-2xs"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
                                                    <Link
                                                        href={`/admin/shops/${shop.id}/edit`}
                                                        title="Edit Shop Details"
                                                        className="rounded-xl border border-border bg-card p-2 text-muted-foreground transition hover:border-primary hover:text-primary shadow-2xs"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(shop)}
                                                        title="Delete Shop"
                                                        className="rounded-xl border border-border bg-card p-2 text-muted-foreground transition hover:border-destructive hover:bg-destructive/10 hover:text-destructive shadow-2xs"
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
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-border p-4 sm:flex-row text-xs">
                            <span className="text-muted-foreground">
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
