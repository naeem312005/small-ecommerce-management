import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Layers, Package, RotateCw, Save, Sparkles, Store } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Shop } from '@/types';

type Props = {
    shop: Shop | null;
    suggestedSku: string;
    categories?: string[];
};

const defaultCategories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Health & Beauty',
    'Books & Stationery',
    'Sports & Outdoors',
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shop Management', href: '/shop-owner/dashboard' },
    { title: 'Shared Catalog', href: '/shop-owner/catalog' },
    { title: 'Create Product', href: '/shop-owner/catalog/create' },
];

export default function ShopOwnerCatalogCreate({ shop, suggestedSku, categories = defaultCategories }: Props) {
    const categoryOptions = categories.length > 0 ? categories : defaultCategories;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: suggestedSku || '',
        category: categoryOptions[0] || 'Electronics',
        base_price: '',
        description: '',
        thumbnail: null as File | null,
        add_to_my_shop: true,
        shop_price: '',
        shop_stock: 50,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const generateRandomSku = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setData('sku', `PRD-${code}`);
    };

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
                        className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Create & Contribute New Product
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Products you create will be added to the shared catalog so other shop owners can discover and list them too.
                        </p>
                    </div>
                </div>

                {/* Info Callout */}
                <div className="max-w-3xl rounded-2xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
                    <div className="flex items-start gap-3">
                        <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div className="text-xs text-foreground">
                            <span className="font-bold text-blue-900 dark:text-blue-200">
                                Shared Catalog Contribution:
                            </span>{' '}
                            When you submit this product, it immediately enters the shared platform catalog. You can simultaneously list it in your own shop (<strong>{shop?.name ?? 'My Shop'}</strong>) with custom stock and pricing.
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold text-foreground">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Ergonomic Bluetooth Mouse"
                                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* SKU & Category */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-semibold text-foreground">
                                        Catalog SKU *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={generateRandomSku}
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
                                        title="Generate a new unique SKU"
                                    >
                                        <Sparkles className="h-3 w-3" />
                                        <span>Auto Generate</span>
                                    </button>
                                </div>
                                <div className="relative mt-1.5">
                                    <input
                                        type="text"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value.toUpperCase())}
                                        placeholder="PRD-XXXXXX"
                                        className="w-full rounded-xl border border-input bg-background py-2.5 pl-3 pr-10 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={generateRandomSku}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        title="Regenerate SKU"
                                    >
                                        <RotateCw className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                    Auto-generated unique identifier. You can also customize or type your own SKU.
                                </p>
                                {errors.sku && (
                                    <p className="mt-1 text-xs text-destructive">{errors.sku}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-foreground">
                                    Category *
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    required
                                >
                                    {categoryOptions.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-xs text-destructive">{errors.category}</p>
                                )}
                            </div>
                        </div>

                        {/* Base Price */}
                        <div>
                            <label className="block text-xs font-semibold text-foreground">
                                Catalog Suggested Base Price / MSRP ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.base_price}
                                onChange={(e) => setData('base_price', e.target.value)}
                                placeholder="0.00"
                                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                required
                            />
                            {errors.base_price && (
                                <p className="mt-1 text-xs text-destructive">{errors.base_price}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-foreground">
                                Master Description & Specs
                            </label>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe product features, specs, and details..."
                                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-destructive">{errors.description}</p>
                            )}
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="block text-xs font-semibold text-foreground">
                                Product Image
                            </label>
                            <div className="mt-1.5 flex items-center gap-4">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-16 w-16 rounded-2xl object-cover ring-1 ring-border"
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
                                    className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-blue-50 file:py-1.5 file:px-3 file:text-xs file:font-semibold file:text-primary hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
                                />
                            </div>
                            {errors.thumbnail && (
                                <p className="mt-1 text-xs text-destructive">{errors.thumbnail}</p>
                            )}
                        </div>

                        {/* Add to my shop section */}
                        {shop && (
                            <div className="rounded-2xl border border-border bg-muted/40 p-5">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="add_to_my_shop"
                                        checked={data.add_to_my_shop}
                                        onChange={(e) => setData('add_to_my_shop', e.target.checked)}
                                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                    />
                                    <label
                                        htmlFor="add_to_my_shop"
                                        className="text-xs font-bold text-foreground"
                                    >
                                        Also list this product immediately in my shop ({shop.name})
                                    </label>
                                </div>

                                {data.add_to_my_shop && (
                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 pt-3 border-t border-border">
                                        <div>
                                            <label className="block text-xs font-semibold text-foreground">
                                                Shop Selling Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.shop_price}
                                                onChange={(e) => setData('shop_price', e.target.value)}
                                                placeholder={data.base_price || 'Same as base price'}
                                                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-foreground">
                                                Initial Inventory Stock
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={data.shop_stock}
                                                onChange={(e) => setData('shop_stock', parseInt(e.target.value) || 0)}
                                                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 border-t border-border pt-5">
                            <Link
                                href="/shop-owner/catalog"
                                className="rounded-xl border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors"
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

