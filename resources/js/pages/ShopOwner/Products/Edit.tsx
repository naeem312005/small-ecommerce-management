import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Image as ImageIcon,
    Layers,
    Package,
    RotateCcw,
    Save,
    Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ShopProduct } from '@/types';

type Props = {
    shopProduct: ShopProduct;
};

export default function ShopOwnerProductsEdit({ shopProduct }: Props) {
    const product = shopProduct.product;
    const shop = shopProduct.shop;

    const { data, setData, processing, errors } = useForm({
        price: String(shopProduct.price),
        custom_title: shopProduct.custom_title || '',
        custom_description: shopProduct.custom_description || '',
        stock: shopProduct.stock,
        is_available: shopProduct.is_available,
        custom_thumbnail: null as File | null,
        remove_custom_thumbnail: false,
    });

    const [preview, setPreview] = useState<string | null>(
        shopProduct.custom_thumbnail || null
    );

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                custom_thumbnail: file,
                remove_custom_thumbnail: false,
            }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRevertToMaster = () => {
        setData((prev) => ({
            ...prev,
            custom_thumbnail: null,
            remove_custom_thumbnail: true,
        }));
        setPreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/shop-owner/products/${shopProduct.id}`, {
            _method: 'post',
            ...data,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Shop Management', href: '/shop-owner/dashboard' },
        { title: 'My Shop Products', href: '/shop-owner/products' },
        { title: 'Customize Listing', href: `/shop-owner/products/${shopProduct.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Customize Listing - ${shopProduct.display_title}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/shop-owner/products"
                        className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Customize Shop Product Listing
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Set your shop-specific price, custom marketing details, and personalized thumbnail for {shop?.name}.
                        </p>
                    </div>
                </div>

                {/* Master Product Comparison Info Card */}
                {product && (
                    <div className="max-w-3xl rounded-2xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900/40 dark:bg-blue-950/30">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            {product.thumbnail ? (
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="h-16 w-16 rounded-xl object-cover ring-1 ring-border"
                                />
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-primary dark:bg-blue-950">
                                    <Package className="h-8 w-8" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                                        <Layers className="h-3 w-3" /> Shared Master Catalog Item
                                    </span>
                                    <span className="text-[11px] font-mono text-muted-foreground">
                                        SKU: {product.sku}
                                    </span>
                                </div>
                                <h3 className="mt-0.5 text-sm font-bold text-foreground">
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Catalog Suggested MSRP / Base Price:{' '}
                                    <strong className="text-foreground font-mono">
                                        ${Number(product.base_price).toFixed(2)}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Customization Form */}
                <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Shop Price & Stock */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-foreground">
                                    Shop Specific Price ($) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    required
                                />
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                    Your store's selling price. Can be higher or lower than the master MSRP.
                                </p>
                                {errors.price && (
                                    <p className="mt-1 text-xs text-destructive">{errors.price}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-foreground">
                                    Inventory Stock in Shop *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', parseInt(e.target.value) || 0)}
                                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    required
                                />
                                {errors.stock && (
                                    <p className="mt-1 text-xs text-destructive">{errors.stock}</p>
                                )}
                            </div>
                        </div>

                        {/* Custom Title Override */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-foreground">
                                    Shop-Specific Product Title (Optional Override)
                                </label>
                                <span className="text-[11px] text-muted-foreground">
                                    Leave blank to use default catalog title
                                </span>
                            </div>
                            <input
                                type="text"
                                value={data.custom_title}
                                onChange={(e) => setData('custom_title', e.target.value)}
                                placeholder={product?.name || 'Custom shop title...'}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            {errors.custom_title && (
                                <p className="mt-1 text-xs text-destructive">{errors.custom_title}</p>
                            )}
                        </div>

                        {/* Custom Description Override */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-foreground">
                                    Shop-Specific Details & Description (Optional Override)
                                </label>
                                <span className="text-[11px] text-muted-foreground">
                                    Leave blank to use default catalog description
                                </span>
                            </div>
                            <textarea
                                rows={4}
                                value={data.custom_description}
                                onChange={(e) => setData('custom_description', e.target.value)}
                                placeholder={product?.description || 'Custom shop description, bundle details, or warranty info...'}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            {errors.custom_description && (
                                <p className="mt-1 text-xs text-destructive">{errors.custom_description}</p>
                            )}
                        </div>

                        {/* Custom Thumbnail Override */}
                        <div>
                            <label className="block text-xs font-semibold text-foreground">
                                Shop-Specific Thumbnail Image (Optional Override)
                            </label>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Upload a custom image tailored for your shop branding, or keep the master catalog thumbnail.
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-6">
                                {/* Current Active Image */}
                                <div>
                                    <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">
                                        Active Thumbnail:
                                    </span>
                                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-border bg-muted">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Custom thumbnail"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : product?.thumbnail ? (
                                            <img
                                                src={product.thumbnail}
                                                alt="Master thumbnail"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="mt-1 block text-[10px] text-muted-foreground">
                                        {preview ? 'Custom Image' : 'Using Master Image'}
                                    </span>
                                </div>

                                {/* Upload & Revert controls */}
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFile}
                                        className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-blue-50 file:py-1.5 file:px-3 file:text-xs file:font-semibold file:text-primary hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
                                    />

                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={handleRevertToMaster}
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline block"
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                            <span>Revert to Master Catalog Image</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            {errors.custom_thumbnail && (
                                <p className="mt-1 text-xs text-destructive">{errors.custom_thumbnail}</p>
                            )}
                        </div>

                        {/* Availability Toggle */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                            <input
                                type="checkbox"
                                id="is_available"
                                checked={data.is_available}
                                onChange={(e) => setData('is_available', e.target.checked)}
                                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                            />
                            <label htmlFor="is_available" className="text-xs font-semibold text-foreground">
                                Available in Storefront (Uncheck to hide this product from customers in your shop)
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t border-border pt-5">
                            <Link
                                href="/shop-owner/products"
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
                                <span>{processing ? 'Saving...' : 'Save Customizations'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

