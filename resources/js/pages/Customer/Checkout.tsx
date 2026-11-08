import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Lock,
    Package,
    ShieldCheck,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';
import CustomerLayout from '@/layouts/customer-layout';
import { sweetAlert } from '@/lib/alert';

export default function CustomerCheckout() {
    const { items, subtotal, totalCount, clearCart } = useCart();

    const [fullName, setFullName] = useState('Alex Mercer');
    const [email, setEmail] = useState('alex.mercer@example.com');
    const [phone, setPhone] = useState('+1 (555) 782-9901');
    const [address, setAddress] = useState('742 Silicon Boulevard, Tech District');
    const [city, setCity] = useState('San Francisco');
    const [postalCode, setPostalCode] = useState('94107');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
    const [processing, setProcessing] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

    const freeShippingThreshold = 150;
    const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 12;
    const orderTotal = subtotal + shippingFee;

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        setTimeout(async () => {
            const orderNumber = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
            setOrderConfirmed(orderNumber);
            setProcessing(false);
            clearCart();

            await sweetAlert.success(
                'Order Confirmed!',
                `Thank you, ${fullName}! Your order #${orderNumber} is confirmed and will be dispatched directly by our boutique partners.`
            );
        }, 900);
    };

    if (orderConfirmed) {
        return (
            <CustomerLayout>
                <Head title="Order Confirmed — Velora Market" />
                <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-[#16A34A] dark:bg-emerald-950/50">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <span className="mt-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#16A34A] dark:bg-emerald-950/60">
                        Payment & Order Verified
                    </span>
                    <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl dark:text-[#F8FAFC]">
                        Thank you for your order!
                    </h1>
                    <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                        Order Confirmation: <strong className="font-mono text-[#0F172A] dark:text-[#F8FAFC]">#{orderConfirmed}</strong>
                    </p>

                    <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 text-left shadow-xs dark:border-[#334155] dark:bg-[#1E293B]">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                            Delivery Destination
                        </h3>
                        <p className="mt-2 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                            {fullName} • {phone}
                        </p>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                            {address}, {city} {postalCode}
                        </p>
                        <p className="mt-3 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                            Confirmation receipts have been routed to <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{email}</strong>.
                        </p>
                    </div>

                    <div className="mt-8 flex justify-center gap-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1D4ED8]"
                        >
                            <span>Return to Storefront</span>
                        </Link>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    if (items.length === 0) {
        return (
            <CustomerLayout>
                <Head title="Checkout — Velora Market" />
                <div className="mx-auto max-w-xl px-4 py-20 text-center">
                    <ShoppingBag className="mx-auto h-16 w-16 text-[#64748B]" />
                    <h2 className="mt-4 text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        No items in checkout
                    </h2>
                    <p className="mt-2 text-xs text-[#64748B]">
                        Your shopping bag is empty. Add products from our boutiques to proceed with checkout.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-xs font-bold text-white hover:bg-[#1D4ED8]"
                        >
                            <span>Browse Catalog</span>
                        </Link>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <Head title="Secure Checkout — Velora Market" />

            {/* Breadcrumb Header */}
            <div className="border-b border-[#E2E8F0] bg-[#FFFFFF] px-4 py-3 dark:border-[#334155] dark:bg-[#0F172A]">
                <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    <Link href="/" className="hover:text-[#2563EB] transition">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/cart" className="hover:text-[#2563EB] transition">
                        Bag
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                        Checkout
                    </span>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] transition"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Return to Shopping Bag</span>
                    </Link>
                    <h1 className="mt-3 text-2xl font-black tracking-tight text-[#0F172A] sm:text-3xl dark:text-[#F8FAFC]">
                        Secure Checkout
                    </h1>
                </div>

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Left Form: Shipping & Payment */}
                    <div className="space-y-8 lg:col-span-7">
                        {/* Shipping Destination */}
                        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-xs dark:border-[#334155] dark:bg-[#1E293B]">
                            <div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-4 dark:border-[#334155]">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">
                                    1
                                </div>
                                <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    Shipping Destination & Contact
                                </h2>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                            className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            required
                                            className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                            Postal / ZIP Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            required
                                            className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-xs dark:border-[#334155] dark:bg-[#1E293B]">
                            <div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-4 dark:border-[#334155]">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">
                                    2
                                </div>
                                <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                    Payment Selection
                                </h2>
                            </div>

                            <div className="mt-5 space-y-3">
                                <label
                                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                                        paymentMethod === 'card'
                                            ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/40'
                                            : 'border-[#E2E8F0] bg-[#FFFFFF] dark:border-[#334155] dark:bg-[#1E293B]'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')}
                                            className="h-4 w-4 text-[#2563EB]"
                                        />
                                        <div>
                                            <span className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                Credit / Debit Card
                                            </span>
                                            <span className="text-[11px] text-[#64748B]">
                                                Instant 256-Bit SSL Encrypted Processing
                                            </span>
                                        </div>
                                    </div>
                                    <CreditCard className="h-5 w-5 text-[#2563EB]" />
                                </label>

                                <label
                                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                                        paymentMethod === 'cod'
                                            ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/40'
                                            : 'border-[#E2E8F0] bg-[#FFFFFF] dark:border-[#334155] dark:bg-[#1E293B]'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => setPaymentMethod('cod')}
                                            className="h-4 w-4 text-[#2563EB]"
                                        />
                                        <div>
                                            <span className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                                Cash on Delivery (COD)
                                            </span>
                                            <span className="text-[11px] text-[#64748B]">
                                                Pay upon package receipt at your doorstep
                                            </span>
                                        </div>
                                    </div>
                                    <Truck className="h-5 w-5 text-[#64748B]" />
                                </label>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="mt-5 space-y-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 dark:border-[#334155] dark:bg-[#0F172A]">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#64748B]">
                                            Card Number (Demo Sandbox)
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="4242 •••• •••• 4242"
                                            className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-mono text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                                            readOnly
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-[#64748B]">
                                                Expiration
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="12/28"
                                                className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-mono text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-[#64748B]">
                                                CVC / CVV
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="888"
                                                className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-mono text-[#0F172A] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-xs dark:border-[#334155] dark:bg-[#1E293B]">
                            <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                Order Review ({totalCount} items)
                            </h2>

                            <div className="mt-4 max-h-60 divide-y divide-[#E2E8F0] overflow-y-auto pr-1 text-xs dark:divide-[#334155]">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#0F172A]">
                                                {item.thumbnail ? (
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[#64748B]">
                                                        <Package className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] line-clamp-1 max-w-[170px]">
                                                    {item.title}
                                                </h4>
                                                <span className="text-[11px] text-[#64748B]">
                                                    Qty {item.quantity} • {item.shopName}
                                                </span>
                                            </div>
                                        </div>

                                        <span className="font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-3 border-t border-[#E2E8F0] pt-4 text-xs dark:border-[#334155]">
                                <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                                    <span>Subtotal</span>
                                    <span className="font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                                    <span>Shipping</span>
                                    <span className="font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                        {shippingFee === 0 ? (
                                            <span className="text-[#16A34A] uppercase font-bold">Free</span>
                                        ) : (
                                            `$${shippingFee.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="border-t border-[#E2E8F0] pt-3 text-base dark:border-[#334155]">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                            Total Amount
                                        </span>
                                        <span className="font-mono font-black text-[#2563EB]">
                                            ${orderTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1D4ED8] disabled:opacity-50"
                                >
                                    <Lock className="h-3.5 w-3.5" />
                                    <span>
                                        {processing ? 'Processing Order...' : `Place Order • $${orderTotal.toFixed(2)}`}
                                    </span>
                                </button>
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#64748B]">
                                <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                                <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </CustomerLayout>
    );
}

