import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    Mail,
    MapPin,
    Minus,
    Package,
    Phone,
    Plus,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    Star,
    Store,
    Truck,
} from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';
import CustomerLayout from '@/layouts/customer-layout';
import { notify } from '@/lib/alert';
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
        notify.success(`Added ${quantity}x "${title}" to your bag!`);
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
            <div className="border-b border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 dark:border-[#334155] dark:bg-[#0F172A]">
                <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    <Link href="/" className="hover:text-[#2563EB] transition">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/shops" className="hover:text-[#2563EB] transition">
                        Boutiques
                    </Link>
                    <span>/</span>
                    <Link href={`/shops/${shop.slug}`} className="hover:text-[#2563EB] transition">
                        {shop.name}
                    </Link>
                    <span>/</span>
                    <span className="truncate text-[#0F172A] font-semibold dark:text-[#F8FAFC]">
                        {title}
                    </span>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Back to boutique link */}
                <Link
                    href={`/shops/${shop.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] transition dark:text-[#94A3B8]"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to {shop.name} Storefront</span>
                </Link>

                {/* PDP Grid */}
                <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Left: Product Media Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] shadow-xs dark:border-[#334155] dark:bg-[#0F172A]">
                            {thumbnail ? (
                                <img
                                    src={thumbnail}
                                    alt={title}
                                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#64748B]">
                                    <Package className="h-24 w-24" />
                                </div>
                            )}

                            {/* Boutique Overlay Pill */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold text-[#0F172A] border border-[#E2E8F0] backdrop-blur-md shadow-xs dark:bg-[#0F172A]/90 dark:text-[#F8FAFC] dark:border-[#334155]">
                                    <Store className="h-3.5 w-3.5 text-[#2563EB]" />
                                    <span>{shop.name}</span>
                                </span>
                            </div>
                        </div>

                        {/* Guarantee Badges */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 text-center dark:border-[#334155] dark:bg-[#1E293B]">
                                <Truck className="mx-auto h-4 w-4 text-[#2563EB]" />
                                <span className="mt-1 block text-[11px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    Fast Dispatch
                                </span>
                                <span className="text-[10px] text-[#64748B]">Within 24 Hours</span>
                            </div>
                            <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 text-center dark:border-[#334155] dark:bg-[#1E293B]">
                                <ShieldCheck className="mx-auto h-4 w-4 text-[#16A34A]" />
                                <span className="mt-1 block text-[11px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    100% Authentic
                                </span>
                                <span className="text-[10px] text-[#64748B]">Vetted Creator</span>
                            </div>
                            <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 text-center dark:border-[#334155] dark:bg-[#1E293B]">
                                <RotateCcw className="mx-auto h-4 w-4 text-[#F59E0B]" />
                                <span className="mt-1 block text-[11px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    30-Day Returns
                                </span>
                                <span className="text-[10px] text-[#64748B]">Prepaid Label</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Buy Box & Product Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-[#EFF6FF] px-2.5 py-1 text-xs font-bold text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-300">
                                {shopProduct.product?.category || 'Specialty'}
                            </span>
                            <div className="flex items-center gap-1 text-[#F59E0B]">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]"
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    4.9
                                </span>
                                <span className="text-xs text-[#64748B]">(48 boutique reviews)</span>
                            </div>
                        </div>

                        <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl dark:text-[#F8FAFC]">
                            {title}
                        </h1>

                        <div className="mt-2 flex items-center gap-2 text-xs text-[#64748B]">
                            <span>Sold & Shipped by</span>
                            <Link
                                href={`/shops/${shop.slug}`}
                                className="font-bold text-[#2563EB] hover:underline"
                            >
                                {shop.name}
                            </Link>
                            <span>•</span>
                            <span className="text-[#16A34A] font-semibold">Verified Partner</span>
                        </div>

                        {/* Price Display */}
                        <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-xs dark:border-[#334155] dark:bg-[#1E293B]">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
                                    ${price.toFixed(2)}
                                </span>
                                {isCustomPrice && shopProduct.product && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="line-through text-[#64748B]">
                                            ${Number(shopProduct.product.base_price).toFixed(2)}
                                        </span>
                                        <span className="rounded-lg bg-[#EFF6FF] px-2 py-0.5 font-bold text-[#2563EB]">
                                            Boutique Pricing
                                        </span>
                                    </div>
                                )}
                            </div>

                            <p className="mt-2 text-xs text-[#64748B]">
                                Or 4 interest-free payments of <strong>${installment}</strong> with Klarna or Afterpay.
                            </p>

                            <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-3 text-xs dark:border-[#334155]">
                                <span className="text-[#64748B]">Availability:</span>
                                {shopProduct.stock > 0 ? (
                                    <span className="flex items-center gap-1.5 font-bold text-[#16A34A]">
                                        <CheckCircle2 className="h-4 w-4" />
                                        In Stock ({shopProduct.stock} units ready to ship)
                                    </span>
                                ) : (
                                    <span className="font-bold text-[#DC2626]">Currently Out of Stock</span>
                                )}
                            </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] dark:border-[#334155] dark:bg-[#1E293B]">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="p-3 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 text-center text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.min(shopProduct.stock || 99, q + 1)
                                            )
                                        }
                                        className="p-3 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={shopProduct.stock <= 0}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold transition shadow-md shadow-blue-500/10 ${
                                        added
                                            ? 'bg-[#16A34A] text-white'
                                            : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-40'
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
                                className="w-full rounded-xl bg-[#0F172A] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#1E293B] disabled:opacity-40 dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8]"
                            >
                                Instant Checkout
                            </button>
                        </div>

                        {/* Merchant Accordion / Tabs */}
                        <div className="mt-10 border-t border-[#E2E8F0] pt-6 dark:border-[#334155]">
                            <div className="flex border-b border-[#E2E8F0] dark:border-[#334155]">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('description')}
                                    className={`border-b-2 py-3 px-4 text-xs font-bold transition ${
                                        activeTab === 'description'
                                            ? 'border-[#2563EB] text-[#2563EB]'
                                            : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                                    }`}
                                >
                                    Product Description
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('merchant')}
                                    className={`border-b-2 py-3 px-4 text-xs font-bold transition ${
                                        activeTab === 'merchant'
                                            ? 'border-[#2563EB] text-[#2563EB]'
                                            : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                                    }`}
                                >
                                    About {shop.name}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('shipping')}
                                    className={`border-b-2 py-3 px-4 text-xs font-bold transition ${
                                        activeTab === 'shipping'
                                            ? 'border-[#2563EB] text-[#2563EB]'
                                            : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                                    }`}
                                >
                                    Shipping & Policies
                                </button>
                            </div>

                            <div className="py-5">
                                {activeTab === 'description' && (
                                    <div className="text-xs leading-relaxed text-[#0F172A] dark:text-[#F8FAFC]">
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
                                                    className="h-12 w-12 rounded-xl object-cover ring-1 ring-[#E2E8F0] dark:ring-[#334155]"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB] text-white font-bold">
                                                    <Store className="h-6 w-6" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                    {shop.name}
                                                </h3>
                                                <span className="font-mono text-xs text-[#2563EB]">
                                                    velora.com/shops/{shop.slug}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-[#64748B] leading-relaxed dark:text-[#94A3B8]">
                                            {shop.description || 'Specialty merchant curating items from the catalog.'}
                                        </p>

                                        <div className="space-y-1.5 pt-2 text-xs text-[#64748B]">
                                            {shop.address && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3.5 w-3.5 text-[#64748B]" />
                                                    <span>{shop.address}</span>
                                                </div>
                                            )}
                                            {shop.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3.5 w-3.5 text-[#64748B]" />
                                                    <span>{shop.email}</span>
                                                </div>
                                            )}
                                            {shop.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3.5 w-3.5 text-[#64748B]" />
                                                    <span>{shop.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'shipping' && (
                                    <div className="space-y-3 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                                        <div className="flex items-start gap-2.5">
                                            <Truck className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="text-[#0F172A] dark:text-[#F8FAFC]">
                                                    Dispatch & Delivery
                                                </strong>
                                                <p>Orders ship within 1-2 business days with full online tracking.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <RotateCcw className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="text-[#0F172A] dark:text-[#F8FAFC]">
                                                    30-Day Return Guarantee
                                                </strong>
                                                <p>Items in unworn condition may be returned within 30 days for a full refund.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products from same boutique */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-20 border-t border-[#E2E8F0] pt-12 dark:border-[#334155]">
                        <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                            More Curated Items From {shop.name}
                        </h2>
                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.slice(0, 4).map((rel) => {
                                const relTitle = rel.display_title || rel.product?.name || 'Untitled';
                                const relThumb = rel.display_thumbnail || rel.product?.thumbnail;

                                return (
                                    <Link
                                        key={rel.id}
                                        href={`/shops/${shop.slug}/products/${rel.id}`}
                                        className="group rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-xs transition hover:-translate-y-1 hover:shadow-md dark:border-[#334155] dark:bg-[#1E293B]"
                                    >
                                        <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A]">
                                            {relThumb ? (
                                                <img
                                                    src={relThumb}
                                                    alt={relTitle}
                                                    className="h-full w-full object-cover transition group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[#64748B]">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="mt-3 text-xs font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#2563EB] transition dark:text-[#F8FAFC]">
                                            {relTitle}
                                        </h4>
                                        <p className="mt-1 text-sm font-black text-[#0F172A] dark:text-[#F8FAFC]">
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
