import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    Heart,
    Mail,
    MapPin,
    Minus,
    Package,
    Phone,
    Plus,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Store,
    Truck,
} from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';
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
    const { addItem, setIsOpen } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'merchant' | 'shipping'>('description');

    const title = shopProduct.display_title || shopProduct.product?.name || 'Untitled';
    const thumbnail = shopProduct.display_thumbnail || shopProduct.product?.thumbnail;
    const description = shopProduct.display_description || shopProduct.product?.description;
    const isCustomPrice =
        shopProduct.product && Number(shopProduct.price) !== Number(shopProduct.product.base_price);
    const price = Number(shopProduct.price);
    const installment = (price / 4).toFixed(2);

    const handleAddToCart = () => {
        addItem({
            id: shopProduct.id,
            shopId: shop.id,
            shopName: shop.name,
            shopSlug: shop.slug,
            title,
            price,
            thumbnail,
            stock: shopProduct.stock,
            quantity,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        setIsOpen(true);
    };

    return (
        <CustomerLayout>
            <Head title={`${title} — ${shop.name} | Velora`} />

            {/* Breadcrumb Header */}
            <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-slate-500">
                    <Link href="/" className="hover:text-indigo-600 transition">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/shops" className="hover:text-indigo-600 transition">
                        Boutiques
                    </Link>
                    <span>/</span>
                    <Link href={`/shops/${shop.slug}`} className="hover:text-indigo-600 transition">
                        {shop.name}
                    </Link>
                    <span>/</span>
                    <span className="truncate text-slate-900 font-semibold dark:text-white">
                        {title}
                    </span>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Back to boutique link */}
                <Link
                    href={`/shops/${shop.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to {shop.name} Storefront</span>
                </Link>

                {/* PDP Grid */}
                <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Left: Product Media Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-800">
                            {thumbnail ? (
                                <img
                                    src={thumbnail}
                                    alt={title}
                                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <Package className="h-24 w-24" />
                                </div>
                            )}

                            {/* Boutique Overlay Pill */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md shadow-md">
                                    <Store className="h-3.5 w-3.5 text-indigo-400" />
                                    <span>{shop.name}</span>
                                </span>
                            </div>
                        </div>

                        {/* Guarantee Badges */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">
                                <Truck className="mx-auto h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="mt-1 block text-[11px] font-bold text-slate-900 dark:text-white">
                                    Fast Dispatch
                                </span>
                                <span className="text-[10px] text-slate-400">Within 24 Hours</span>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">
                                <ShieldCheck className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="mt-1 block text-[11px] font-bold text-slate-900 dark:text-white">
                                    100% Authentic
                                </span>
                                <span className="text-[10px] text-slate-400">Vetted Creator</span>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">
                                <RotateCcw className="mx-auto h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <span className="mt-1 block text-[11px] font-bold text-slate-900 dark:text-white">
                                    30-Day Returns
                                </span>
                                <span className="text-[10px] text-slate-400">Prepaid Label</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Buy Box & Product Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                {shopProduct.product?.category || 'Specialty'}
                            </span>
                            <div className="flex items-center gap-1 text-amber-500">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    4.9
                                </span>
                                <span className="text-xs text-slate-400">(48 boutique reviews)</span>
                            </div>
                        </div>

                        <h1 className="mt-3 font-serif text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                            {title}
                        </h1>

                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <span>Sold & Shipped by</span>
                            <Link
                                href={`/shops/${shop.slug}`}
                                className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                {shop.name}
                            </Link>
                            <span>•</span>
                            <span className="text-emerald-600 font-semibold">Verified Partner</span>
                        </div>

                        {/* Price Display */}
                        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-black text-slate-950 dark:text-white">
                                    ${price.toFixed(2)}
                                </span>
                                {isCustomPrice && shopProduct.product && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="line-through text-slate-400">
                                            ${Number(shopProduct.product.base_price).toFixed(2)}
                                        </span>
                                        <span className="rounded-lg bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                            Boutique Pricing
                                        </span>
                                    </div>
                                )}
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                Or 4 interest-free payments of <strong>${installment}</strong> with Klarna or Afterpay.
                            </p>

                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                                <span className="text-slate-500">Availability:</span>
                                {shopProduct.stock > 0 ? (
                                    <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="h-4 w-4" />
                                        In Stock ({shopProduct.stock} units ready to ship)
                                    </span>
                                ) : (
                                    <span className="font-bold text-rose-500">Currently Out of Stock</span>
                                )}
                            </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center rounded-2xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="p-3 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.min(shopProduct.stock || 99, q + 1)
                                            )
                                        }
                                        className="p-3 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={shopProduct.stock <= 0}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold uppercase tracking-wider transition shadow-md ${
                                        added
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40'
                                    }`}
                                >
                                    {added ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            <span>Added to Bag!</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="h-4 w-4" />
                                            <span>Add to Shopping Bag</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={shopProduct.stock <= 0}
                                className="w-full rounded-2xl bg-slate-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-slate-800 disabled:opacity-40 dark:bg-slate-800 dark:hover:bg-slate-700"
                            >
                                Instant Checkout
                            </button>
                        </div>

                        {/* Merchant Accordion / Tabs */}
                        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
                            <div className="flex border-b border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('description')}
                                    className={`border-b-2 py-3 px-4 text-xs font-bold transition ${
                                        activeTab === 'description'
                                            ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    Product Description
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('merchant')}
                                    className={`border-b-2 py-3 px-4 text-xs font-bold transition ${
                                        activeTab === 'merchant'
                                            ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    About {shop.name}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('shipping')}
                                    className={`border-b-2 py-3 px-4 text-xs font-bold transition ${
                                        activeTab === 'shipping'
                                            ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    Shipping & Policies
                                </button>
                            </div>

                            <div className="py-5">
                                {activeTab === 'description' && (
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                        <p className="whitespace-pre-line">{description}</p>
                                    </div>
                                )}

                                {activeTab === 'merchant' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            {shop.logo ? (
                                                <img
                                                    src={shop.logo}
                                                    alt={shop.name}
                                                    className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">
                                                    <Store className="h-6 w-6" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {shop.name}
                                                </h4>
                                                <span className="text-[11px] text-slate-500">
                                                    Verified Boutique Merchant
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {shop.description || 'Welcome to our independent boutique storefront.'}
                                        </p>
                                        <div className="space-y-1.5 text-xs text-slate-500">
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
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            <span>Visit Full Storefront</span>
                                            <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                                        </Link>
                                    </div>
                                )}

                                {activeTab === 'shipping' && (
                                    <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                                        <p>
                                            <strong>Complimentary Express Shipping:</strong> Orders over $150 qualify for free express courier delivery worldwide.
                                        </p>
                                        <p>
                                            <strong>Packaging & Dispatch:</strong> Handled directly by {shop.name} within 24 hours of payment verification.
                                        </p>
                                        <p>
                                            <strong>Returns & Exchanges:</strong> 30-day money back guarantee with prepaid return shipping labels included with every order.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* More from this Shop */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 border-t border-slate-200 pt-12 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                    More Recommendations
                                </span>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                    More from {shop.name}
                                </h2>
                            </div>
                            <Link
                                href={`/shops/${shop.slug}`}
                                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                View all items
                            </Link>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((rel) => {
                                const relTitle = rel.display_title || rel.product?.name || 'Untitled';
                                const relThumb = rel.display_thumbnail || rel.product?.thumbnail;

                                return (
                                    <Link
                                        key={rel.id}
                                        href={`/shops/${shop.slug}/products/${rel.id}`}
                                        className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
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
