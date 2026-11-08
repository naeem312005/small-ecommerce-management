import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FolderPlus, Save, Sparkles, Tag } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
    { title: 'New Category', href: '/admin/categories/create' },
];

const availableIcons = [
    { label: 'Tag (General)', value: 'Tag' },
    { label: 'Laptop (Electronics & Tech)', value: 'Laptop' },
    { label: 'Shirt (Apparel & Fashion)', value: 'Shirt' },
    { label: 'Home (Furniture & Living)', value: 'Home' },
    { label: 'Sparkles (Beauty & Wellness)', value: 'Sparkles' },
    { label: 'BookOpen (Books & Stationery)', value: 'BookOpen' },
    { label: 'Activity (Sports & Outdoors)', value: 'Activity' },
];

export default function AdminCategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        icon: 'Tag',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category — Admin Console" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/categories"
                        className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground shadow-2xs transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">
                            Create New Product Category
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Define a new product classification to structure the master catalog and customer storefront discovery.
                        </p>
                    </div>
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
                                placeholder="e.g. Modern Workspace, Kitchen & Dining"
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
                                URL Slug <span className="text-muted-foreground font-normal">(Optional — auto-generated from name)</span>
                            </label>
                            <div className="mt-1.5 flex rounded-xl border border-input bg-background overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                                <span className="inline-flex items-center px-3 text-xs text-muted-foreground bg-muted/40 border-r border-border select-none">
                                    /categories/
                                </span>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="auto-generated-if-empty"
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
                                placeholder="Short editorial summary explaining what kinds of products belong in this category..."
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
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
                                <span>{processing ? 'Saving...' : 'Save Category'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

