import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    CheckCircle2,
    Minus,
    Package,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Trash2,
    Truck,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';

export default function CartDrawer() {
    const {
        items,
        isOpen,
        setIsOpen,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
    } = useCart();

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

    const freeShippingThreshold = 150;
    const progressToFreeShipping = Math.min(
        100,
        Math.round((subtotal / freeShippingThreshold) * 100)
    );
    const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
    const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 12;
    const orderTotal = subtotal + shippingFee;

    const handleCheckout = () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            const fakeOrderNumber = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
            setOrderSuccess(fakeOrderNumber);
            setIsCheckingOut(false);
            clearCart();
        }, 900);
    };

    const handleClose = () => {
        setIsOpen(false);
        setOrderSuccess(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                onClick={handleClose}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="w-screen max-w-md transform bg-white shadow-2xl transition duration-300 dark:bg-slate-900">
                    <div className="flex h-full flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                            <div className="flex items-center gap-2.5">
                                <ShoppingBag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Your Shopping Bag
                                </h2>
                                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                                    {totalCount}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Free Shipping Progress */}
                        {subtotal > 0 && !orderSuccess && (
                            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-3 text-xs dark:border-slate-800 dark:bg-slate-950/50">
                                <div className="flex items-center justify-between font-medium">
                                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                        <Truck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                        {subtotal >= freeShippingThreshold ? (
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                You qualified for Free Express Shipping! 🎉
                                            </span>
                                        ) : (
                                            <span>
                                                Add{' '}
                                                <strong className="text-indigo-600 dark:text-indigo-400">
                                                    ${amountNeeded.toFixed(2)}
                                                </strong>{' '}
                                                more for free shipping
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-[11px] font-semibold text-slate-400">
                                        {progressToFreeShipping}%
                                    </span>
                                </div>
                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                                        style={{ width: `${progressToFreeShipping}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {orderSuccess ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md dark:bg-emerald-950 dark:text-emerald-400">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                                        Order Placed Successfully!
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Reference Code:{' '}
                                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                            {orderSuccess}
                                        </span>
                                    </p>
                                    <p className="mt-3 max-w-xs text-xs text-slate-600 dark:text-slate-400">
                                        Your order was routed to the respective boutique merchant partners. A confirmation email has been dispatched.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-500"
                                    >
                                        <span>Continue Shopping</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                                        <ShoppingBag className="h-8 w-8" />
                                    </div>
                                    <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                                        Your bag is currently empty
                                    </h3>
                                    <p className="mt-1 max-w-xs text-xs text-slate-500">
                                        Explore curated goods from our independent boutiques and add items to your cart.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="mt-5 rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Explore Products
                                    </button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex gap-4 py-4">
                                            {/* Thumbnail */}
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                                                {item.thumbnail ? (
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                        <Package className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                                        {item.shopName}
                                                    </span>
                                                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 dark:text-white">
                                                        {item.title}
                                                    </h4>
                                                    <p className="mt-0.5 text-xs font-black text-slate-900 dark:text-white">
                                                        ${Number(item.price).toFixed(2)}
                                                    </p>
                                                </div>

                                                {/* Quantity Controls & Delete */}
                                                <div className="mt-2 flex items-center justify-between">
                                                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity - 1)
                                                            }
                                                            className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-7 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity + 1)
                                                            }
                                                            className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-slate-400 transition hover:text-rose-600"
                                                        title="Remove from bag"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer / Summary */}
                        {items.length > 0 && !orderSuccess && (
                            <div className="border-t border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Estimated Express Shipping</span>
                                        <span>
                                            {shippingFee === 0 ? (
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    FREE
                                                </span>
                                            ) : (
                                                `$${shippingFee.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                                        <span>Total</span>
                                        <span className="text-base text-indigo-600 dark:text-indigo-400">
                                            ${orderTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    {isCheckingOut ? (
                                        <span>Processing Order...</span>
                                    ) : (
                                        <>
                                            <ShieldCheck className="h-4 w-4" />
                                            <span>Proceed to Secure Checkout</span>
                                        </>
                                    )}
                                </button>

                                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>256-Bit SSL Encrypted • Buyer Protection Included</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

