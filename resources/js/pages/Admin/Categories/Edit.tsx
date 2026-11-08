import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Package, Save, Trash2 } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { sweetAlert } from '@/lib/alert';
import type { BreadcrumbItem, Category } from '@/types';

type Props = {
    category: Category;
};

const availableIcons = [
    { label: 'Tag (General)', value: 'Tag' },
    { label: 'Laptop (Electronics & Tech)', value: 'Laptop' },
    { label: 'Shirt (Apparel & Fashion)', value: 'Shirt' },
    { label: 'Home (Furniture & Living)', value: 'Home' },
    { label: 'Sparkles (Beauty & Wellness)', value: 'Sparkles' },
    { label: 'BookOpen (Books & Stationery)', value: 'BookOpen' },
    { label: 'Activity (Sports & Outdoors)', value: 'Activity' },
];

export default function AdminCategoriesEdit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || 'Tag',
        is_active: category.is_active,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Console', href: '/admin/dashboard' },
        { title: 'Categories', href: '/admin/categories' },
        { title: `Edit: ${category.name}`, href: `/admin/categories/${category.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    };

    const handleDelete = async () => {
        const productWarning = category.products_count && category.products_count > 0
            ? ` This category currently has ${category.products_count} linked product(s) which will become unassigned.`
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${category.name} — Admin Console`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/categories"
                            className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground shadow-2xs transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-foreground">
                                    Edit Category: {category.name}
                                </h1>
                                {category.is_active ? (
                                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                                        Active
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-500/20">
                                        Inactive
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Update category metadata, URL slug, and visibility settings.
                            </p>
                        </div>
                    </div>

                    {category.products_count !== undefined && (
                        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-xs">
                            <Package className="h-4 w-4 text-primary" />
                            <span>
                                <strong className="text-foreground">{category.products_count}</strong> products assigned
                            </span>
                        </div>
                    )}
                </div>

                {/* Form Card */}
                <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Category Name <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                URL Slug
                            </label>
                            <div className="mt-1.5 flex rounded-xl border border-input bg-background overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                                <span className="inline-flex items-center px-3 text-xs text-muted-foreground bg-muted/40 border-r border-border select-none">
                                    /categories/
                                </span>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className="flex-1 border-0 bg-transparent py-2.5 px-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none"
                                />
                            </div>
                            {errors.slug && (
                                <p className="mt-1 text-xs text-destructive">{errors.slug}</p>
                            )}
                        </div>

                        {/* Icon Selection */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Category Icon
                            </label>
                            <select
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                                {availableIcons.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {errors.icon && (
                                <p className="mt-1 text-xs text-destructive">{errors.icon}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-destructive">{errors.description}</p>
                            )}
                        </div>

                        {/* Active Toggle */}
                        <div className="pt-2 border-t border-border/60">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                />
                                <div>
                                    <span className="text-xs font-bold text-foreground">
                                        Active in Catalog & Storefront
                                    </span>
                                    <p className="text-[11px] text-muted-foreground">
                                        When active, this category is selectable when adding products and visible in customer storefront filters.
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete Category</span>
                            </button>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/admin/categories"
                                    className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-opacity"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>{processing ? 'Saving...' : 'Update Category'}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

