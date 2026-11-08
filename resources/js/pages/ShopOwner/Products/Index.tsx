import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit2,
    ExternalLink,
    Filter,
    Layers,
    Package,
    PackagePlus,
    Search,
    Store,
    Trash2,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Shop, ShopProduct } from '@/types';

type Props = {
    shop: Shop;
    shopProducts: PaginatedData<ShopProduct>;
    filters: {
        search?: string;
        status?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shop Management', href: '/shop-owner/dashboard' },
    { title: 'My Shop Products', href: '/shop-owner/products' },
];

export default function ShopOwnerProductsIndex({
    shop,
    shopProducts,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [removeProductId, setRemoveProductId] = useState<number | null>(null);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/shop-owner/products',
            {
                search: search || undefined,
                status: status || undefined,
            },
            { preserveState: true }
        );
    };

    const confirmRemove = () => {
        if (removeProductId) {
            router.delete(`/shop-owner/products/${removeProductId}`, {
                onSuccess: () => setRemoveProductId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`My Shop Products - ${shop.name}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                My Shop Product Listings
                            </h1>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {shop.name}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Set custom prices, details, thumbnails, and manage inventory for items listed in your store.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/shop-owner/catalog"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500"
                        >
                            <Layers className="h-4 w-4" />
                            <span>Add from Shared Catalog</span>
                        </Link>
                        <Link
                            href="/shop-owner/catalog/create"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                        >
                            <PackagePlus className="h-4 w-4" />
                            <span>Contribute New Product</span>
                        </Link>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <form
                    onSubmit={handleFilter}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by custom title, product name, or SKU..."
                            className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-xl border border-slate-300 py-2 pl-3 pr-8 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                            <option value="">All Availability</option>
                            <option value="1">Available in Shop</option>
                            <option value="0">Hidden / Unavailable</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600 dark:bg-slate-800"
                        >
                            Filter
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 bg-slate-50 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3 px-4">Listed Product</th>
                                <th className="py-3 px-4">Catalog SKU</th>
                                <th className="py-3 px-4 text-right">Shop Price</th>
                                <th className="py-3 px-4 text-right">Catalog Base</th>
                                <th className="py-3 px-4 text-center">Stock</th>
                                <th className="py-3 px-4 text-center">Store Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {shopProducts.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-slate-500">
                                        No products listed in your shop matching this filter.{' '}
                                        <Link href="/shop-owner/catalog" className="font-semibold text-indigo-600 hover:underline">
                                            Browse the shared catalog
                                        </Link>{' '}
                                        to add items.
                                    </td>
                                </tr>
                            ) : (
                                shopProducts.data.map((item) => {
                                    const title = item.display_title || item.product?.name || 'Untitled';
                                    const thumbnail = item.display_thumbnail || item.product?.thumbnail;
                                    const isPriceOverridden =
                                        item.product && Number(item.price) !== Number(item.product.base_price);

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    {thumbnail ? (
                                                        <img
                                                            src={thumbnail}
                                                            alt={title}
                                                            className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                                            <Package className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                                            {title}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-[10px]">
                                                            {item.custom_title && (
                                                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                                                    Custom Title
                                                                </span>
                                                            )}
                                                            {item.custom_thumbnail && (
                                                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                                                    • Custom Image
                                                                </span>
                                                            )}
                                                            {item.custom_description && (
                                                                <span className="text-violet-600 dark:text-violet-400 font-semibold">
                                                                    • Custom Description
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                                                {item.product?.sku}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <span className="font-black text-slate-900 dark:text-white">
                                                    ${Number(item.price).toFixed(2)}
                                                </span>
                                                {isPriceOverridden && (
                                                    <span className="block text-[10px] font-semibold text-emerald-600">
                                                        Overridden
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                                                ${Number(item.product?.base_price ?? 0).toFixed(2)}
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-bold">
                                                {item.stock > 0 ? (
                                                    <span className="text-slate-800 dark:text-slate-200">{item.stock}</span>
                                                ) : (
                                                    <span className="text-rose-500">0</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                {item.is_available ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                        <CheckCircle2 className="h-3 w-3" /> Live in Store
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                                        <XCircle className="h-3 w-3" /> Hidden
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a
                                                        href={`/shops/${shop.slug}/products/${item.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Preview in Storefront"
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                    <Link
                                                        href={`/shop-owner/products/${item.id}/edit`}
                                                        title="Customize Price, Details & Thumbnail"
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setRemoveProductId(item.id)}
                                                        title="Remove from my shop"
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {shopProducts.links && shopProducts.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-slate-200 p-4 text-xs dark:border-slate-800">
                            <span className="text-slate-500">
                                Showing {shopProducts.from ?? 0} to {shopProducts.to ?? 0} of {shopProducts.total} shop products
                            </span>
                            <div className="flex items-center gap-1">
                                {shopProducts.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : !link.url
                                                  ? 'cursor-not-allowed text-slate-400'
                                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Remove Confirmation Modal */}
            {removeProductId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Remove from Shop Listings
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                            Are you sure you want to remove this product from your shop?
                            <br />
                            <strong>Note:</strong> This only removes it from your shop. The master product remains intact in the shared catalog, and you can re-add it at any time.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setRemoveProductId(null)}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmRemove}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
                            >
                                Yes, Remove from Shop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
