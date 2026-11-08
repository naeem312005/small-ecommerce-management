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
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Customize Shop Product Listing
                        </h1>
                        <p className="text-xs text-slate-500">
                            Set your shop-specific price, custom marketing details, and personalized thumbnail for {shop?.name}.
                        </p>
                    </div>
                </div>

                {/* Master Product Comparison Info Card */}
                {product && (
                    <div className="max-w-3xl rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            {product.thumbnail ? (
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="h-16 w-16 rounded-xl object-cover ring-1 ring-indigo-200 dark:ring-indigo-800"
                                />
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                                    <Package className="h-8 w-8" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                                        <Layers className="h-3 w-3" /> Shared Master Catalog Item
                                    </span>
                                    <span className="text-[11px] font-mono text-slate-500">
                                        SKU: {product.sku}
                                    </span>
                                </div>
                                <h3 className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                    Catalog Suggested MSRP / Base Price:{' '}
                                    <strong className="text-slate-900 dark:text-white font-mono">
                                        ${Number(product.base_price).toFixed(2)}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Customization Form */}
                <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Shop Price & Stock */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Shop Specific Price ($) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                    required
                                />
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Your store's selling price. Can be higher or lower than the master MSRP.
                                </p>
                                {errors.price && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.price}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Inventory Stock in Shop *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', parseInt(e.target.value) || 0)}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                    required
                                />
                                {errors.stock && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>
                                )}
                            </div>
                        </div>

                        {/* Custom Title Override */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Shop-Specific Product Title (Optional Override)
                                </label>
                                <span className="text-[11px] text-slate-400">
                                    Leave blank to use default catalog title
                                </span>
                            </div>
                            <input
                                type="text"
                                value={data.custom_title}
                                onChange={(e) => setData('custom_title', e.target.value)}
                                placeholder={product?.name || 'Custom shop title...'}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                            {errors.custom_title && (
                                <p className="mt-1 text-xs text-rose-500">{errors.custom_title}</p>
                            )}
                        </div>

                        {/* Custom Description Override */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Shop-Specific Details & Description (Optional Override)
                                </label>
                                <span className="text-[11px] text-slate-400">
                                    Leave blank to use default catalog description
                                </span>
                            </div>
                            <textarea
                                rows={4}
                                value={data.custom_description}
                                onChange={(e) => setData('custom_description', e.target.value)}
                                placeholder={product?.description || 'Custom shop description, bundle details, or warranty info...'}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                            {errors.custom_description && (
                                <p className="mt-1 text-xs text-rose-500">{errors.custom_description}</p>
                            )}
                        </div>

                        {/* Custom Thumbnail Override */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Shop-Specific Thumbnail Image (Optional Override)
                            </label>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                                Upload a custom image tailored for your shop branding, or keep the master catalog thumbnail.
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-6">
                                {/* Current Active Image */}
                                <div>
                                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                                        Active Thumbnail:
                                    </span>
                                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
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
                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="mt-1 block text-[10px] text-slate-500">
                                        {preview ? 'Custom Image' : 'Using Master Image'}
                                    </span>
                                </div>

                                {/* Upload & Revert controls */}
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFile}
                                        className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:py-1.5 file:px-3 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                    />

                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={handleRevertToMaster}
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:underline block"
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                            <span>Revert to Master Catalog Image</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            {errors.custom_thumbnail && (
                                <p className="mt-1 text-xs text-rose-500">{errors.custom_thumbnail}</p>
                            )}
                        </div>

                        {/* Availability Toggle */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <input
                                type="checkbox"
                                id="is_available"
                                checked={data.is_available}
                                onChange={(e) => setData('is_available', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="is_available" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Available in Storefront (Uncheck to hide this product from customers in your shop)
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <Link
                                href="/shop-owner/products"
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
                                <span>{processing ? 'Saving...' : 'Save Customizations'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

