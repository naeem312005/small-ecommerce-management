import { Link, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    CreditCard,
    Heart,
    HelpCircle,
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    Package,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Store,
    Truck,
    User as UserIcon,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import CartDrawer from '@/components/cart-drawer';
import DemoSwitcher from '@/components/demo-switcher';
import { useCart } from '@/context/cart-context';
import type { User } from '@/types';

function NavbarContent({
    user,
    mobileMenuOpen,
    setMobileMenuOpen,
}: {
    user: User | null;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}) {
    const { totalCount, setIsOpen } = useCart();

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                {/* Brand */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="group flex items-center gap-3 transition">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-950 via-indigo-900 to-indigo-600 text-white shadow-md shadow-indigo-950/20 transition group-hover:scale-105">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-serif text-xl font-black tracking-tight text-slate-950 dark:text-white">
                                    VELORA
                                </span>
                                <span className="rounded-sm bg-indigo-600 px-1 py-0.2 text-[9px] font-bold tracking-widest uppercase text-white">
                                    MARKET
                                </span>
                            </div>
                            <span className="block text-[10px] font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                Curated Boutiques & Goods
                            </span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href="/"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                        >
                            All Products
                        </Link>
                        <Link
                            href="/shops"
                            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                        >
                            <Store className="h-3.5 w-3.5 text-slate-400" />
                            <span>Boutique Directory</span>
                        </Link>
                    </nav>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    {/* Cart Trigger */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-xs transition hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        aria-label="View shopping bag"
                    >
                        <ShoppingBag className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="hidden sm:inline">Bag</span>
                        {totalCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white shadow-sm">
                                {totalCount}
                            </span>
                        )}
                    </button>

                    {/* User Authentication Pill */}
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                            >
                                <LayoutDashboard className="h-3.5 w-3.5" />
                                <span>
                                    {user.role === 'admin'
                                        ? 'Admin Console'
                                        : user.role === 'shop_owner'
                                          ? 'Merchant Portal'
                                          : 'My Dashboard'}
                                </span>
                            </Link>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                title="Sign out"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Logout</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                <LogIn className="h-3.5 w-3.5" />
                                <span>Sign In</span>
                            </Link>
                            <Link
                                href="/login"
                                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500"
                            >
                                <span>Merchant Portal</span>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="inline-flex rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Drawer */}
            {mobileMenuOpen && (
                <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-900">
                    <div className="space-y-2">
                        <Link
                            href="/"
                            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            All Showcase Products
                        </Link>
                        <Link
                            href="/shops"
                            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Explore Boutiques Directory
                        </Link>
                        {!user && (
                            <Link
                                href="/login"
                                className="block rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Merchant & Admin Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    const { auth, flash } = usePage<{
        auth: { user: User | null };
        flash: { success?: string; error?: string };
    }>().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
                {/* Top Announcement Ribbon */}
                <div className="bg-slate-950 px-4 py-2 text-[11px] font-medium tracking-wide text-slate-300 sm:px-6">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
                            <span>
                                Complimentary express delivery on all orders over $150 • Guaranteed Authentic Boutique Goods
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-slate-400">
                            <Link href="/shops" className="hover:text-white transition">
                                Independent Boutiques
                            </Link>
                            <span>•</span>
                            <Link href="/login" className="hover:text-white transition">
                                Sell on Velora
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Navbar */}
                <NavbarContent
                    user={user}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="border-b border-rose-200 bg-rose-50 px-4 py-3 text-center text-xs font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300">
                        {flash.error}
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1">{children}</main>

                {/* Footer */}
                <footer className="border-t border-slate-200 bg-white pt-16 pb-12 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
                            {/* Brand Column */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md dark:bg-indigo-600">
                                        <ShoppingBag className="h-4 w-4" />
                                    </div>
                                    <span className="font-serif text-lg font-black tracking-tight text-slate-950 dark:text-white">
                                        VELORA MARKET
                                    </span>
                                </div>
                                <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Velora is a modern multi-vendor commerce collective connecting discerning customers with vetted independent artisans, tech innovators, and specialty boutiques worldwide.
                                </p>
                                <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                    <span>Verified Merchant Catalog Isolation • Centralized Stock</span>
                                </div>
                            </div>

                            {/* Discover */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                                    Discover
                                </h4>
                                <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                                    <li>
                                        <Link href="/" className="hover:text-indigo-600 transition">
                                            Curated Products
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/shops" className="hover:text-indigo-600 transition">
                                            All Boutiques
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/shops/technova-gadgets" className="hover:text-indigo-600 transition">
                                            TechNova Flagship
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/shops/aura-apparel-co" className="hover:text-indigo-600 transition">
                                            Aura Apparel Studio
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Merchant Hub */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                                    Merchants
                                </h4>
                                <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                                    <li>
                                        <Link href="/login" className="hover:text-indigo-600 transition">
                                            Merchant Portal
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/login" className="hover:text-indigo-600 transition">
                                            Administrator Console
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="text-slate-400">Shared Catalog Distribution</span>
                                    </li>
                                    <li>
                                        <span className="text-slate-400">Price Customization Engine</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Customer Concierge */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                                    Customer Care
                                </h4>
                                <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                                    <li className="flex items-center gap-1.5">
                                        <Truck className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Express Global Delivery</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                                        <span>30-Day Hassle-Free Returns</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Secure 256-Bit SSL Checkout</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Strip */}
                        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row dark:border-slate-800">
                            <p className="text-xs text-slate-500">
                                © 2026 Velora Commerce, Inc. All rights reserved.
                            </p>
                            <div className="flex items-center gap-6 text-xs text-slate-500">
                                <span>Terms of Service</span>
                                <span>Privacy Policy</span>
                                <span>Merchant Agreement</span>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* Slide-over Cart Drawer */}
                <CartDrawer />

                {/* Floating Demo Persona Switcher */}
                <DemoSwitcher />
            </div>
    );
}
