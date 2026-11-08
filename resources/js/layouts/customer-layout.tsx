import { Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    CreditCard,
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    Moon,
    ShieldCheck,
    ShoppingBag,
    Store,
    Sun,
    Truck,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import CartDrawer from '@/components/cart-drawer';
import DemoSwitcher from '@/components/demo-switcher';
import { useCart } from '@/context/cart-context';
import { useAppearance } from '@/hooks/use-appearance';
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
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-md dark:border-[#334155] dark:bg-[#0F172A]/95">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                {/* Brand Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="group flex items-center gap-3 transition">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-md shadow-blue-500/20 transition group-hover:bg-[#1D4ED8]">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-serif text-xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                                    VELORA
                                </span>
                                <span className="rounded-md bg-[#2563EB] px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase text-white">
                                    MARKET
                                </span>
                            </div>
                            <span className="block text-[10px] font-medium tracking-wide text-[#64748B] uppercase dark:text-[#94A3B8]">
                                Premium Curated Goods
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href="/"
                            className="text-xs font-semibold tracking-wide text-[#0F172A] hover:text-[#2563EB] transition dark:text-[#F8FAFC] dark:hover:text-[#3B82F6]"
                        >
                            All Products
                        </Link>
                        <Link
                            href="/shops"
                            className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#64748B] hover:text-[#2563EB] transition dark:text-[#94A3B8] dark:hover:text-[#3B82F6]"
                        >
                            <Store className="h-3.5 w-3.5" />
                            <span>Boutique Directory</span>
                        </Link>
                    </nav>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                    {/* Theme Toggle Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-2 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition shadow-xs dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#94A3B8] dark:hover:text-white"
                        title="Toggle color theme"
                        aria-label="Toggle color theme"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4 w-4 text-[#F59E0B]" />
                        ) : (
                            <Moon className="h-4 w-4 text-[#64748B]" />
                        )}
                    </button>

                    {/* Cart Trigger Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="relative flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3.5 py-2 text-xs font-semibold text-[#0F172A] shadow-xs transition hover:border-[#2563EB] hover:bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                        aria-label="View shopping bag"
                    >
                        <ShoppingBag className="h-4 w-4 text-[#2563EB]" />
                        <span className="hidden sm:inline">Bag</span>
                        {totalCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1.5 text-[11px] font-bold text-white shadow-xs">
                                {totalCount}
                            </span>
                        )}
                    </button>

                    {/* User Authentication Actions */}
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#1D4ED8]"
                            >
                                <LayoutDashboard className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">
                                    {user.role === 'admin'
                                        ? 'Admin Console'
                                        : user.role === 'shop_owner'
                                          ? 'Merchant Hub'
                                          : 'My Dashboard'}
                                </span>
                            </Link>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs font-medium text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:border-[#334155] dark:hover:bg-[#1E293B]"
                                title="Sign out"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                <span className="hidden md:inline">Sign Out</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] shadow-xs transition hover:border-[#2563EB] hover:bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                            >
                                <LogIn className="h-3.5 w-3.5 text-[#64748B]" />
                                <span>Sign In</span>
                            </Link>
                            <Link
                                href="/login"
                                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#1D4ED8]"
                            >
                                <span>Merchant Portal</span>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Hamburger */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="inline-flex rounded-xl p-2 text-[#64748B] hover:bg-[#F8FAFC] md:hidden dark:hover:bg-[#1E293B]"
                        aria-label="Toggle navigation"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Drawer */}
            {mobileMenuOpen && (
                <div className="border-b border-[#E2E8F0] bg-[#FFFFFF] px-4 py-4 md:hidden dark:border-[#334155] dark:bg-[#0F172A]">
                    <div className="space-y-2">
                        <Link
                            href="/"
                            className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:text-[#F8FAFC] dark:hover:bg-[#1E293B]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            All Products
                        </Link>
                        <Link
                            href="/shops"
                            className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:bg-[#1E293B]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Boutiques Directory
                        </Link>
                        {!user && (
                            <Link
                                href="/login"
                                className="block rounded-xl bg-[#EFF6FF] px-3 py-2 text-sm font-bold text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Merchant & Admin Portal
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<{
        auth: { user: User | null };
    }>().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-[#F8FAFC] font-sans text-[#0F172A] antialiased selection:bg-[#2563EB] selection:text-white dark:bg-[#0F172A] dark:text-[#F8FAFC]">
            {/* Top Announcement Ribbon */}
            <div className="border-b border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2 text-[11px] font-medium text-[#64748B] sm:px-6 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#94A3B8]">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                        <span>
                            Complimentary express delivery on orders over $150 • 100% Verified Merchant Guarantee
                        </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <Link href="/shops" className="hover:text-[#2563EB] transition">
                            Explore Boutiques
                        </Link>
                        <span>•</span>
                        <Link href="/login" className="hover:text-[#2563EB] transition">
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

            {/* Main Page Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] pt-16 pb-12 dark:border-[#334155] dark:bg-[#0F172A]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
                        {/* Brand Column */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-md shadow-blue-500/20">
                                    <ShoppingBag className="h-4 w-4" />
                                </div>
                                <span className="font-serif text-lg font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                                    VELORA MARKET
                                </span>
                            </div>
                            <p className="mt-4 max-w-sm text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                                A curated multi-vendor e-commerce platform connecting customers directly with independent boutique storefronts and shared artisan catalogs.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#16A34A]">
                                <ShieldCheck className="h-4 w-4" />
                                <span>Verified Merchant Catalog Isolation • Centralized Stock</span>
                            </div>
                        </div>

                        {/* Discover */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
                                Discover
                            </h4>
                            <ul className="mt-4 space-y-2.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                                <li>
                                    <Link href="/" className="hover:text-[#2563EB] transition">
                                        Curated Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shops" className="hover:text-[#2563EB] transition">
                                        All Boutiques
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shops/technova-gadgets" className="hover:text-[#2563EB] transition">
                                        TechNova Flagship
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shops/aura-apparel-co" className="hover:text-[#2563EB] transition">
                                        Aura Apparel Studio
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Merchant Hub */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
                                Merchants
                            </h4>
                            <ul className="mt-4 space-y-2.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                                <li>
                                    <Link href="/login" className="hover:text-[#2563EB] transition">
                                        Merchant Portal
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="hover:text-[#2563EB] transition">
                                        Administrator Console
                                    </Link>
                                </li>
                                <li>
                                    <span className="text-[#64748B]/70">Shared Catalog Distribution</span>
                                </li>
                                <li>
                                    <span className="text-[#64748B]/70">Price Customization Engine</span>
                                </li>
                            </ul>
                        </div>

                        {/* Customer Concierge */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
                                Customer Care
                            </h4>
                            <ul className="mt-4 space-y-2.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                                <li className="flex items-center gap-1.5">
                                    <Truck className="h-3.5 w-3.5 text-[#2563EB]" />
                                    <span>Express Global Delivery</span>
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                                    <span>30-Day Hassle-Free Returns</span>
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <CreditCard className="h-3.5 w-3.5 text-[#2563EB]" />
                                    <span>Secure 256-Bit SSL Checkout</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Strip */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] pt-8 sm:flex-row dark:border-[#334155]">
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                            © 2026 Velora Commerce, Inc. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-xs text-[#64748B] dark:text-[#94A3B8]">
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
