import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Minus,
    Package,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Trash2,
    Truck,
} from 'lucide-react';
import React from 'react';
import { useCart } from '@/context/cart-context';
import CustomerLayout from '@/layouts/customer-layout';

export default function CustomerCart() {
    const {
        items,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
    } = useCart();

    const freeShippingThreshold = 150;
    const progressToFreeShipping = Math.min(
        100,
        Math.round((subtotal / freeShippingThreshold) * 100)
    );
    const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
    const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 12;
    const orderTotal = subtotal + shippingFee;

    return (
        <CustomerLayout>
            <Head title="Shopping Bag — Velora Market" />

            {/* Breadcrumb Header */}
            <div className="border-b border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 dark:border-[#334155] dark:bg-[#0F172A]">
                <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    <Link href="/" className="hover:text-[#2563EB] transition">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                        Shopping Bag ({totalCount})
                    </span>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E2E8F0] pb-6 dark:border-[#334155]">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]">
                            Your Shopping Bag
                        </h1>
                        <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                            Review items added across our curated independent boutiques.
                        </p>
                    </div>

                    {items.length > 0 && (
                        <button
                            type="button"
                            onClick={clearCart}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DC2626] hover:underline"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Clear Bag</span>
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/50">
                            <ShoppingBag className="h-10 w-10" />
                        </div>
                        <h2 className="mt-6 text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                            Your bag is currently empty
                        </h2>
                        <p className="mx-auto mt-2 max-w-sm text-xs text-[#64748B] dark:text-[#94A3B8]">
                            Discover unique artisan wares, electronics, and fashion from our verified merchant boutiques.
                        </p>
                        <div className="mt-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1D4ED8]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Start Shopping</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
                        {/* Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            {/* Free Shipping Banner */}
                            <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-xs dark:border-[#334155] dark:bg-[#1E293B]">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                        <Truck className="h-4 w-4 text-[#2563EB]" />
                                        {amountNeeded > 0 ? (
                                            <span>
                                                Add{' '}
                                                <strong className="text-[#2563EB]">
                                                    ${amountNeeded.toFixed(2)}
                                                </strong>{' '}
                                                more for Complimentary Express Shipping!
                                            </span>
                                        ) : (
                                            <span className="text-[#16A34A] font-bold">
                                                🎉 You've unlocked Complimentary Express Shipping!
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-mono text-[11px] text-[#64748B]">
                                        {progressToFreeShipping}%
                                    </span>
                                </div>
                                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0] dark:bg-[#334155]">
                                    <div
                                        className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                                        style={{ width: `${progressToFreeShipping}%` }}
                                    />
                                </div>
                            </div>

                            {/* Item Rows */}
                            <div className="divide-y divide-[#E2E8F0] rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs dark:divide-[#334155] dark:border-[#334155] dark:bg-[#1E293B]">
                                {items.map((item) => (
                                    <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#0F172A]">
                                                {item.thumbnail ? (
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[#64748B]">
                                                        <Package className="h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Link
                                                    href={`/shops/${item.shopSlug}`}
                                                    className="text-[11px] font-semibold text-[#2563EB] hover:underline"
                                                >
                                                    {item.shopName}
                                                </Link>
                                                <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] line-clamp-1">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 font-mono text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">
                                                    ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-6 sm:justify-end">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#0F172A]">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 text-[#64748B] hover:text-[#0F172A] transition dark:hover:text-white"
                                                    title="Decrease quantity"
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 text-[#64748B] hover:text-[#0F172A] transition dark:hover:text-white"
                                                    title="Increase quantity"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>

                                            {/* Line Total */}
                                            <div className="text-right min-w-[70px]">
                                                <span className="font-mono text-sm font-black text-[#0F172A] dark:text-[#F8FAFC]">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="rounded-lg p-2 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#DC2626] transition dark:hover:bg-[#0F172A]"
                                                title="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    <span>Continue Shopping</span>
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-xs dark:border-[#334155] dark:bg-[#1E293B]">
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    Order Summary
                                </h2>

                                <div className="mt-5 space-y-3.5 text-xs">
                                    <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                                        <span>Subtotal ({totalCount} items)</span>
                                        <span className="font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                                        <span>Estimated Delivery</span>
                                        <span className="font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                            {shippingFee === 0 ? (
                                                <span className="text-[#16A34A] uppercase font-bold">Free</span>
                                            ) : (
                                                `$${shippingFee.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>

                                    <div className="border-t border-[#E2E8F0] pt-3.5 dark:border-[#334155]">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                Estimated Total
                                            </span>
                                            <span className="font-mono text-base font-black text-[#2563EB]">
                                                ${orderTotal.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                                            Tax calculated at checkout based on delivery address.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link
                                        href="/checkout"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1D4ED8]"
                                    >
                                        <span>Proceed to Checkout</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                <div className="mt-6 space-y-2 border-t border-[#E2E8F0] pt-5 text-[11px] text-[#64748B] dark:border-[#334155] dark:text-[#94A3B8]">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
                                        <span>Verified Merchant Guaranteed Storefronts</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-[#2563EB]" />
                                        <span>Dispatched in 24–48 hours</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
