import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Package, Save } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Product } from '@/types';

type Props = {
    product: Product;
};

export default function AdminProductsEdit({ product }: Props) {
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

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Master Catalog', href: '/admin/products' },
        { title: `Edit ${product.name}`, href: `/admin/products/${product.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${product.name} - Admin Panel`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/products"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Edit Master Catalog Product
                        </h1>
                        <p className="text-xs text-slate-500">
                            Created by: <strong>{product.creator?.name ?? 'Admin'}</strong>
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                            )}
                        </div>

                        {/* SKU & Category */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Product SKU *
                                </label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value.toUpperCase())}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 font-mono text-xs dark:border-slate-700 dark:bg-slate-800"
                                    required
                                />
                                {errors.sku && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.sku}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Category *
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
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
                                    <p className="mt-1 text-xs text-rose-500">{errors.category}</p>
                                )}
                            </div>
                        </div>

                        {/* Base Price */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Master Catalog Base Price ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.base_price}
                                onChange={(e) => setData('base_price', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                required
                            />
                            {errors.base_price && (
                                <p className="mt-1 text-xs text-rose-500">{errors.base_price}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Default Description & Specifications
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
                            )}
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Master Product Thumbnail Image
                            </label>
                            <div className="mt-1.5 flex items-center gap-4">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-300"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                        <Package className="h-8 w-8" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFile}
                                    className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:py-1.5 file:px-3 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                            {errors.thumbnail && (
                                <p className="mt-1 text-xs text-rose-500">{errors.thumbnail}</p>
                            )}
                        </div>

                        {/* Active toggle */}
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="is_active" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Active in Shared Catalog
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <Link
                                href="/admin/products"
                                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                            >
                                <Save className="h-3.5 w-3.5" />
                                <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

