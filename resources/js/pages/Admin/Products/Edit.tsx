import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Package, Save } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Product } from '@/types';

type Props = {
    product: Product;
};

export default function AdminProductsEdit({ product }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Console', href: '/admin/dashboard' },
        { title: 'Master Catalog', href: '/admin/products' },
        { title: `Edit ${product.name}`, href: `/admin/products/${product.id}/edit` },
    ];
    const { data, setData, processing, errors } = useForm({
        name: product.name,
        sku: product.sku,
        category: product.category,
        base_price: String(product.base_price),
        description: product.description || '',
        is_active: product.is_active,
        thumbnail: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(product.thumbnail);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/products/${product.id}`, {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${product.name} — Admin Console`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/products"
                        className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground shadow-2xs transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">
                            Edit Master Catalog Product
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Created by: <strong>{product.creator?.name ?? 'Admin'}</strong>
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* SKU & Category */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold text-foreground">
                                    Product SKU *
                                </label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value.toUpperCase())}
                                    className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 font-mono text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                    required
                                />
                                {errors.sku && (
                                    <p className="mt-1 text-xs text-destructive">{errors.sku}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-foreground">
                                    Category *
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                    required
                                >
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Home & Living">Home & Living</option>
                                    <option value="Health & Beauty">Health & Beauty</option>
                                    <option value="Books & Stationery">Books & Stationery</option>
                                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-xs text-destructive">{errors.category}</p>
                                )}
                            </div>
                        </div>

                        {/* Base Price */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Suggested Base Price ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.base_price}
                                onChange={(e) => setData('base_price', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                required
                            />
                            {errors.base_price && (
                                <p className="mt-1 text-xs text-destructive">{errors.base_price}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Default Specifications & Description
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-destructive">{errors.description}</p>
                            )}
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Thumbnail Image
                            </label>
                            <div className="mt-1.5 flex items-center gap-4">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-16 w-16 rounded-2xl object-cover ring-1 ring-border shadow-2xs"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                        <Package className="h-8 w-8" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFile}
                                    className="text-xs file:mr-2 file:rounded-xl file:border-0 file:bg-primary/10 file:py-1.5 file:px-3 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20 transition"
                                />
                            </div>
                            {errors.thumbnail && (
                                <p className="mt-1 text-xs text-destructive">{errors.thumbnail}</p>
                            )}
                        </div>

                        {/* Active toggle */}
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <label htmlFor="is_active" className="text-xs font-semibold text-foreground">
                                Active in Master Catalog (Available for shop owners)
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 border-t border-border pt-5">
                            <Link
                                href="/admin/products"
                                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50 transition"
                            >
                                <Save className="h-3.5 w-3.5" />
                                <span>{processing ? 'Saving...' : 'Save Product Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
