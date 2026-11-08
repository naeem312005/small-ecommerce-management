import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    CheckCircle2,
    CreditCard,
    MapPin,
    Minus,
    Package,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Trash2,
    Truck,
    User as UserIcon,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { sweetAlert } from '@/lib/alert';

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
    const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

    // Checkout Form State
    const [fullName, setFullName] = useState('Alex Mercer');
    const [email, setEmail] = useState('customer@velora.com');
    const [address, setAddress] = useState('742 Silicon Boulevard, San Francisco, CA');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'digital'>('card');

    const freeShippingThreshold = 150;
    const progressToFreeShipping = Math.min(
        100,
        Math.round((subtotal / freeShippingThreshold) * 100)
    );
    const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
    const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 12;
    const orderTotal = subtotal + shippingFee;

    const handleProceedToCheckout = () => {
        setStep('checkout');
    };

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCheckingOut(true);

        setTimeout(() => {
            const fakeOrderNumber = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
            setOrderSuccess(fakeOrderNumber);
            setIsCheckingOut(false);
            setStep('success');
            clearCart();

            sweetAlert.success(
                'Order Placed Successfully!',
                `Thank you, ${fullName}! Your order #${fakeOrderNumber} has been confirmed and routed to the respective boutique partners.`
            );
        }, 800);
    };

    const handleClose = () => {
        setIsOpen(false);
        setStep('cart');
        setOrderSuccess(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                onClick={handleClose}
                className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-xs transition-opacity duration-300"
            />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
                <div className="w-screen max-w-md transform bg-[#FFFFFF] shadow-2xl transition duration-300 dark:bg-[#1E293B]">
                    <div className="flex h-full flex-col">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 dark:border-[#334155]">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                                    <ShoppingBag className="h-4 w-4" />
                                </div>
                                <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    {step === 'checkout'
                                        ? 'Express Checkout'
                                        : step === 'success'
                                          ? 'Order Confirmed'
                                          : 'Shopping Bag'}
                                </h2>
                                {step === 'cart' && (
                                    <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-bold text-[#2563EB] dark:bg-blue-950 dark:text-blue-300">
                                        {totalCount}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-xl p-2 text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:hover:bg-[#334155] dark:hover:text-[#F8FAFC]"
                                aria-label="Close cart drawer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Free Shipping Progress Indicator */}
                        {subtotal > 0 && step === 'cart' && (
                            <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-3 text-xs dark:border-[#334155] dark:bg-[#0F172A]">
                                <div className="flex items-center justify-between font-medium">
                                    <span className="flex items-center gap-1.5 text-[#0F172A] dark:text-[#F8FAFC]">
                                        <Truck className="h-3.5 w-3.5 text-[#2563EB]" />
                                        {subtotal >= freeShippingThreshold ? (
                                            <span className="font-semibold text-[#16A34A]">
                                                You unlocked Complimentary Express Delivery! 🎉
                                            </span>
                                        ) : (
                                            <span>
                                                Add{' '}
                                                <strong className="text-[#2563EB]">
                                                    ${amountNeeded.toFixed(2)}
                                                </strong>{' '}
                                                more for free delivery
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-[11px] font-semibold text-[#64748B]">
                                        {progressToFreeShipping}%
                                    </span>
                                </div>
                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0] dark:bg-[#334155]">
                                    <div
                                        className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
                                        style={{ width: `${progressToFreeShipping}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {/* SUCCESS STEP */}
                            {step === 'success' && (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#16A34A] shadow-md dark:bg-emerald-950">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                        Thank You for Your Order!
                                    </h3>
                                    <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                                        Order Number:{' '}
                                        <span className="font-mono font-bold text-[#2563EB]">
                                            {orderSuccess}
                                        </span>
                                    </p>
                                    <div className="mt-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-left text-xs space-y-1.5 w-full dark:border-[#334155] dark:bg-[#0F172A]">
                                        <div className="flex justify-between text-[#64748B]">
                                            <span>Customer:</span>
                                            <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{fullName}</strong>
                                        </div>
                                        <div className="flex justify-between text-[#64748B]">
                                            <span>Delivery Address:</span>
                                            <span className="text-[#0F172A] truncate max-w-[180px] dark:text-[#F8FAFC]">
                                                {address}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[#64748B]">
                                            <span>Payment Status:</span>
                                            <span className="font-bold text-[#16A34A]">Confirmed</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#1D4ED8]"
                                    >
                                        <span>Continue Shopping</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* CHECKOUT STEP */}
                            {step === 'checkout' && (
                                <form onSubmit={handlePlaceOrder} className="space-y-4">
                                    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs dark:border-[#334155] dark:bg-[#0F172A]">
                                        <div className="flex justify-between font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                            <span>Order Total ({totalCount} items):</span>
                                            <span className="text-sm font-bold text-[#2563EB]">
                                                ${orderTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Shipping Address Form */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
                                            Shipping Destination
                                        </h4>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                                                Delivery Address
                                            </label>
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Method Selector */}
                                    <div className="pt-2 space-y-2">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
                                            Payment Method
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('card')}
                                                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                                                    paymentMethod === 'card'
                                                        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950 dark:text-blue-300'
                                                        : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#64748B] dark:border-[#334155] dark:bg-[#1E293B]'
                                                }`}
                                            >
                                                <CreditCard className="h-4 w-4" />
                                                <span>Credit Card</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('cod')}
                                                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                                                    paymentMethod === 'cod'
                                                        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950 dark:text-blue-300'
                                                        : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#64748B] dark:border-[#334155] dark:bg-[#1E293B]'
                                                }`}
                                            >
                                                <Truck className="h-4 w-4" />
                                                <span>Pay on Delivery</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep('cart')}
                                            className="rounded-xl border border-[#E2E8F0] px-4 py-3 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] dark:border-[#334155]"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isCheckingOut}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1D4ED8] disabled:opacity-50"
                                        >
                                            {isCheckingOut ? (
                                                <span>Authorizing Payment...</span>
                                            ) : (
                                                <>
                                                    <ShieldCheck className="h-4 w-4" />
                                                    <span>Pay ${orderTotal.toFixed(2)} & Place Order</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* CART ITEMS STEP */}
                            {step === 'cart' && (
                                <>
                                    {items.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center text-center py-12">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8FAFC] text-[#64748B] dark:bg-[#0F172A]">
                                                <ShoppingBag className="h-8 w-8 text-[#2563EB]" />
                                            </div>
                                            <h3 className="mt-4 text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                Your shopping bag is empty
                                            </h3>
                                            <p className="mt-1 max-w-xs text-xs text-[#64748B] dark:text-[#94A3B8]">
                                                Explore curated goods from our boutique storefronts and add your favorite items.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="mt-5 rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#334155] dark:text-[#F8FAFC]"
                                            >
                                                Explore Boutique Products
                                            </button>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
                                            {items.map((item) => (
                                                <li key={item.id} className="flex gap-4 py-4">
                                                    {/* Item Thumbnail */}
                                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#0F172A]">
                                                        {item.thumbnail ? (
                                                            <img
                                                                src={item.thumbnail}
                                                                alt={item.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-[#64748B]">
                                                                <Package className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Item Details */}
                                                    <div className="flex flex-1 flex-col justify-between">
                                                        <div>
                                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB]">
                                                                {item.shopName}
                                                            </span>
                                                            <h4 className="text-xs font-bold text-[#0F172A] line-clamp-1 dark:text-[#F8FAFC]">
                                                                {item.title}
                                                            </h4>
                                                            <p className="mt-0.5 text-xs font-black text-[#0F172A] dark:text-[#F8FAFC]">
                                                                ${Number(item.price).toFixed(2)}
                                                            </p>
                                                        </div>

                                                        {/* Quantity Controls & Delete */}
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <div className="flex items-center rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] dark:border-[#334155] dark:bg-[#1E293B]">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateQuantity(item.id, item.quantity - 1)
                                                                    }
                                                                    className="p-1.5 text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                                                                    aria-label="Decrease quantity"
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </button>
                                                                <span className="w-7 text-center text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateQuantity(item.id, item.quantity + 1)
                                                                    }
                                                                    className="p-1.5 text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                                                                    aria-label="Increase quantity"
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </button>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-[#64748B] transition hover:text-[#DC2626]"
                                                                title="Remove item"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Drawer Footer & Checkout Action */}
                        {items.length > 0 && step === 'cart' && (
                            <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-6 dark:border-[#334155] dark:bg-[#0F172A]">
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                                        <span>Estimated Shipping</span>
                                        <span>
                                            {shippingFee === 0 ? (
                                                <span className="font-bold text-[#16A34A]">
                                                    COMPLIMENTARY
                                                </span>
                                            ) : (
                                                `$${shippingFee.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-[#E2E8F0] pt-2 text-sm font-bold text-[#0F172A] dark:border-[#334155] dark:text-[#F8FAFC]">
                                        <span>Total</span>
                                        <span className="text-base font-black text-[#2563EB]">
                                            ${orderTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <Link
                                        href="/cart"
                                        onClick={handleClose}
                                        className="flex-1 rounded-xl border border-[#E2E8F0] bg-white py-3 text-center text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                                    >
                                        View Full Bag
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleProceedToCheckout}
                                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1D4ED8]"
                                    >
                                        <span>Checkout</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">
                                    <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                                    <span>256-Bit SSL Encrypted • Buyer Protection Guaranteed</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
