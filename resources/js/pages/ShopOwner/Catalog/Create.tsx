import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Layers, Package, Save, Sparkles, Store } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Shop } from '@/types';

type Props = {
    shop: Shop | null;
    suggestedSku: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shop Management', href: '/shop-owner/dashboard' },
    { title: 'Shared Catalog', href: '/shop-owner/catalog' },
    { title: 'Create Product', href: '/shop-owner/catalog/create' },
];

export default function ShopOwnerCatalogCreate({ shop, suggestedSku }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: suggestedSku || '',
        category: 'Electronics',
        base_price: '',
        description: '',
        thumbnail: null as File | null,
        add_to_my_shop: true,
        shop_price: '',
        shop_stock: 50,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/shop-owner/catalog/store');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contribute New Product - Shared Catalog" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/shop-owner/catalog"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Create & Contribute New Product
                        </h1>
                        <p className="text-xs text-slate-500">
                            Products you create will be added to the shared catalog so other shop owners can discover and list them too.
                        </p>
                    </div>
                </div>

                {/* Info Callout */}
                <div className="max-w-3xl rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
                    <div className="flex items-start gap-3">
                        <Sparkles className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-indigo-900 dark:text-indigo-200">
                                Shared Catalog Contribution:
                            </span>{' '}
                            When you submit this product, it immediately enters the shared platform catalog. You can simultaneously list it in your own shop (<strong>{shop?.name ?? 'My Shop'}</strong>) with custom stock and pricing.
                        </div>
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
                                placeholder="e.g. Ergonomic Bluetooth Mouse"
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
                                    Catalog SKU *
                                </label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value.toUpperCase())}
                                    placeholder="PRD-XXXX"
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
                                Catalog Suggested Base Price / MSRP ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.base_price}
                                onChange={(e) => setData('base_price', e.target.value)}
                                placeholder="0.00"
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
                                Master Description & Specs
                            </label>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe product features, specs, and details..."
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
                            )}
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Product Image
                            </label>
                            <div className="mt-1.5 flex items-center gap-4">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-300"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
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

                        {/* Add to my shop section */}
                        {shop && (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="add_to_my_shop"
                                        checked={data.add_to_my_shop}
                                        onChange={(e) => setData('add_to_my_shop', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <label
                                        htmlFor="add_to_my_shop"
                                        className="text-xs font-bold text-emerald-900 dark:text-emerald-200"
                                    >
                                        Also list this product immediately in my shop ({shop.name})
                                    </label>
                                </div>

                                {data.add_to_my_shop && (
                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Shop Selling Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.shop_price}
                                                onChange={(e) => setData('shop_price', e.target.value)}
                                                placeholder={data.base_price || 'Same as base price'}
                                                className="mt-1 w-full rounded-xl border border-slate-300 py-2 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Initial Inventory Stock
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={data.shop_stock}
                                                onChange={(e) => setData('shop_stock', parseInt(e.target.value) || 0)}
                                                className="mt-1 w-full rounded-xl border border-slate-300 py-2 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <Link
                                href="/shop-owner/catalog"
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
                                <span>{processing ? 'Publishing...' : 'Publish to Catalog'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

