import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    Edit3,
    FolderTree,
    Home,
    Laptop,
    Package,
    Plus,
    Search,
    Shirt,
    Sparkles,
    Tag,
    Trash2,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { sweetAlert } from '@/lib/alert';
import type { BreadcrumbItem, Category, PaginatedData } from '@/types';

type Props = {
    categories: PaginatedData<Category>;
    metrics: {
        total: number;
        active: number;
        productsCount: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
];

// Helper to render an icon dynamically
function renderCategoryIcon(iconName: string | null) {
    const iconClass = 'h-4 w-4';
    switch (iconName?.toLowerCase()) {
        case 'laptop':
        case 'electronics':
            return <Laptop className={iconClass} />;
        case 'shirt':
        case 'fashion':
            return <Shirt className={iconClass} />;
        case 'home':
        case 'home & living':
            return <Home className={iconClass} />;
        case 'sparkles':
        case 'health & beauty':
            return <Sparkles className={iconClass} />;
        case 'bookopen':
        case 'books & stationery':
            return <BookOpen className={iconClass} />;
        case 'activity':
        case 'sports & outdoors':
            return <Activity className={iconClass} />;
        default:
            return <Tag className={iconClass} />;
    }
}

export default function AdminCategoriesIndex({ categories, metrics, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/categories',
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
        router.get('/admin/categories');
    };

    const handleDelete = async (category: Category) => {
        const productWarning = category.products_count && category.products_count > 0
            ? ` This category has ${category.products_count} linked product(s) which will become unassigned.`
            : '';

        const confirmed = await sweetAlert.confirm({
            title: `Delete Category "${category.name}"?`,
            text: `Are you sure you want to delete this category?${productWarning}`,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            icon: 'warning',
        });

        if (confirmed) {
            router.delete(`/admin/categories/${category.id}`);
        }
    };

    const hasFilters = Boolean(filters.search || filters.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Categories — Admin Console" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Product Categories
                            </h1>
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                                {metrics.total} Registered
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Create and manage dynamic categories to organize master catalog products and storefront discovery.
                        </p>
                    </div>

                    <Link
                        href="/admin/categories/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create New Category</span>
                    </Link>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Total Categories
                            </span>
                            <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                <FolderTree className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-black text-foreground">
                            {metrics.total}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            Across entire catalog system
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Active in Storefront
                            </span>
                            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
                                <Tag className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-black text-foreground">
                            {metrics.active}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            Live for customers & merchants
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Linked Products
                            </span>
                            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600">
                                <Package className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-black text-foreground">
                            {metrics.productsCount}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            Master products categorized
                        </p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
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
                            placeholder="Search by category name, slug, or description..."
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

                {/* Table Card */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed text-left text-xs min-w-[700px]">
                            <thead className="border-b border-border bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="w-[30%] py-3.5 px-4">Category</th>
                                    <th className="w-[34%] py-3.5 px-4">Description</th>
                                    <th className="w-[12%] py-3.5 px-4 text-center">Assigned Items</th>
                                    <th className="w-[10%] py-3.5 px-4 text-center">Status</th>
                                    <th className="w-[14%] py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {categories.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                            <FolderTree className="mx-auto h-8 w-8 text-muted-foreground/60" />
                                            <p className="mt-2 text-sm font-bold text-foreground">
                                                No categories found
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Try adjusting search parameters or create a new category.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    categories.data.map((cat) => (
                                        <tr
                                            key={cat.id}
                                            className="transition-colors hover:bg-muted/40"
                                        >
                                            {/* Category Info */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-2xs">
                                                        {renderCategoryIcon(cat.icon || cat.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-foreground text-sm truncate">
                                                            {cat.name}
                                                        </div>
                                                        <div className="mt-0.5 font-mono text-[11px] text-muted-foreground truncate">
                                                            slug: {cat.slug}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Description */}
                                            <td className="py-4 px-4">
                                                <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                                                    {cat.description || (
                                                        <span className="italic opacity-60">No description provided</span>
                                                    )}
                                                </p>
                                            </td>

                                            {/* Products Count */}
                                            <td className="py-4 px-4 text-center">
                                                <Link
                                                    href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                                                    className="inline-flex items-center gap-1 rounded-xl bg-muted px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                                >
                                                    <Package className="h-3 w-3 opacity-60" />
                                                    <span>{cat.products_count ?? 0}</span>
                                                </Link>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4 text-center">
                                                {cat.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-500/20">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-[11px] font-bold text-slate-500 border border-slate-500/20">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-4 text-right">
                                                <div className="inline-flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={`/admin/categories/${cat.id}/edit`}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:border-primary hover:text-primary transition-colors shadow-2xs"
                                                        title="Edit category"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(cat)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-destructive/80 hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-colors shadow-2xs"
                                                        title="Delete category"
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
                    {categories.links && categories.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-3">
                            <p className="text-xs text-muted-foreground">
                                Showing <span className="font-bold text-foreground">{categories.from || 0}</span> to{' '}
                                <span className="font-bold text-foreground">{categories.to || 0}</span> of{' '}
                                <span className="font-bold text-foreground">{categories.total}</span> categories
                            </p>
                            <div className="flex items-center gap-1">
                                {categories.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground shadow-2xs'
                                                : link.url
                                                  ? 'border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                                                  : 'cursor-not-allowed opacity-40 text-muted-foreground'
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
