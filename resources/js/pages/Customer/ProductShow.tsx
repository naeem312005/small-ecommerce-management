import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock,
    Globe,
    Layers,
    Mail,
    MapPin,
    Package,
    Phone,
    Shield,
    ShieldCheck,
    Sparkles,
    Store,
    Tag,
} from 'lucide-react';
import React from 'react';
import CustomerLayout from '@/layouts/customer-layout';
import type { Shop, ShopProduct } from '@/types';

type Props = {
    shop: Shop;
    shopProduct: ShopProduct;
    relatedProducts: ShopProduct[];
};

export default function CustomerProductShow({
    shop,
    shopProduct,
    relatedProducts,
}: Props) {
    const title = shopProduct.display_title || shopProduct.product?.name || 'Untitled';
    const thumbnail = shopProduct.display_thumbnail || shopProduct.product?.thumbnail;
    const description = shopProduct.display_description || shopProduct.product?.description;
    const isCustomThumbnail = Boolean(shopProduct.custom_thumbnail);
    const isCustomPrice =
        shopProduct.product && Number(shopProduct.price) !== Number(shopProduct.product.base_price);
    const isCustomTitle = Boolean(shopProduct.custom_title);
    const isCustomDesc = Boolean(shopProduct.custom_description);

    return (
        <CustomerLayout>
            <Head title={`${title} - ${shop.name}`} />

            {/* Breadcrumb Header */}
            <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-slate-500">
                    <Link href="/" className="hover:text-indigo-600">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/shops" className="hover:text-indigo-600">
                        Shops
                    </Link>
                    <span>/</span>
                    <Link href={`/shops/${shop.slug}`} className="hover:text-indigo-600">
                        {shop.name}
                    </Link>
                    <span>/</span>
                    <span className="truncate text-slate-800 font-medium dark:text-slate-200">
                        {title}
                    </span>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href={`/shops/${shop.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to {shop.name} Storefront</span>
                </Link>

                {/* Main Product Layout */}
                <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Left: Product Image */}
                    <div className="space-y-4">
                        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-800">
                            {thumbnail ? (
                                <img
                                    src={thumbnail}
                                    alt={title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <Package className="h-20 w-20" />
                                </div>
                            )}

                            {isCustomThumbnail && (
                                <span className="absolute top-4 right-4 rounded-lg bg-indigo-600/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm">
                                    Shop-Customized Image
                                </span>
                            )}
                        </div>

                        {/* Attribution Card */}
                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs dark:border-indigo-900/60 dark:bg-indigo-950/30">
                            <div className="flex items-start gap-2.5">
                                <Layers className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                                <div>
                                    <span className="font-bold text-indigo-900 dark:text-indigo-200">
                                        Shared Catalog Item
                                    </span>
                                    <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                                        Catalog SKU: <span className="font-mono font-semibold">{shopProduct.product?.sku}</span>
                                        {shopProduct.product?.creator && (
                                            <> • Authored in catalog by <strong>{shopProduct.product.creator.name}</strong></>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Details & Shop Purchase Box */}
                    <div className="flex flex-col">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            {shopProduct.product?.category && (
                                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    {shopProduct.product.category}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Listed in {shop.name}
                            </span>
                        </div>

                        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            {title}
                        </h1>

                        {isCustomTitle && (
                            <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                                (Custom title set specifically for this shop)
                            </p>
                        )}

                        {/* Price Display */}
                        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-slate-900 dark:text-white">
                                    ${Number(shopProduct.price).toFixed(2)}
                                </span>
                                {isCustomPrice && shopProduct.product && (
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <span className="line-through text-slate-400">
                                            ${Number(shopProduct.product.base_price).toFixed(2)}
                                        </span>
                                        <span className="rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                            Shop Customized Price
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                                <span className="text-slate-500">Inventory Status:</span>
                                {shopProduct.stock > 0 ? (
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        In Stock ({shopProduct.stock} available)
                                    </span>
                                ) : (
                                    <span className="font-bold text-rose-500">Currently Out of Stock</span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Product Details & Specifications
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-line dark:text-slate-300">
                                {description}
                            </p>
                            {isCustomDesc && (
                                <p className="mt-2 text-[11px] italic text-indigo-600 dark:text-indigo-400">
                                    * Customized description provided by {shop.name}.
                                </p>
                            )}
                        </div>

                        {/* Shop Seller Box */}
                        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-3.5">
                                {shop.logo ? (
                                    <img
                                        src={shop.logo}
                                        alt={shop.name}
                                        className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                        <Store className="h-6 w-6" />
                                    </div>
                                )}
                                <div>
                                    <span className="text-[11px] uppercase font-semibold text-slate-400">
                                        Sold & Fulfilled by
                                    </span>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                        {shop.name}
                                    </h4>
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                                {shop.description}
                            </p>

                            <div className="mt-4 space-y-1 text-xs text-slate-500 border-t border-slate-200 pt-3 dark:border-slate-800">
                                {shop.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{shop.address}</span>
                                    </div>
                                )}
                                {shop.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{shop.phone}</span>
                                    </div>
                                )}
                            </div>

                            <Link
                                href={`/shops/${shop.slug}`}
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500"
                            >
                                <Store className="h-4 w-4" />
                                <span>Browse More from {shop.name}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Products From This Shop */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            More from {shop.name}
                        </h2>
                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((rel) => {
                                const relTitle = rel.display_title || rel.product?.name || 'Untitled';
                                const relThumb = rel.display_thumbnail || rel.product?.thumbnail;

                                return (
                                    <Link
                                        key={rel.id}
                                        href={`/shops/${shop.slug}/products/${rel.id}`}
                                        className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                                            {relThumb ? (
                                                <img
                                                    src={relThumb}
                                                    alt={relTitle}
                                                    className="h-full w-full object-cover transition group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="mt-3 text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 dark:text-white">
                                            {relTitle}
                                        </h4>
                                        <p className="mt-1 text-xs font-black text-slate-900 dark:text-white">
                                            ${Number(rel.price).toFixed(2)}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
