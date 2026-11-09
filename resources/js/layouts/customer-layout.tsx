import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    ChevronDown,
    CreditCard,
    FileText,
    Heart,
    LayoutDashboard,
    LogIn,
    LogOut,
    MapPin,
    Menu,
    Moon,
    Package,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Store,
    Sun,
    Truck,
    User as UserIcon,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import CartDrawer from '@/components/cart-drawer';
import { useCart } from '@/context/cart-context';
import { useAppearance } from '@/hooks/use-appearance';
import type { User } from '@/types';

function NavbarContent({
    user,
    mobileMenuOpen,
    setMobileMenuOpen,
    onOpenUpcoming,
}: {
    user: User | null;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    onOpenUpcoming: () => void;
}) {
    const { totalCount, setIsOpen } = useCart();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [navSearch, setNavSearch] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const handleNavSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = navSearch.trim();
        if (trimmed) {
            router.get('/', { search: trimmed });
        } else {
            router.get('/');
        }
    };

    // Close user dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-md dark:border-[#334155] dark:bg-[#0F172A]/95">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
                {/* Brand Logo */}
                <div className="flex items-center gap-6 shrink-0">
                    <Link href="/" className="group flex items-center gap-2.5 transition">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-xs transition group-hover:bg-[#1D4ED8]">
                            <ShoppingBag className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-wider text-[#0F172A] leading-none dark:text-[#F8FAFC]">
                                VELORA
                            </span>
                            <span className="mt-1 text-[9px] font-bold tracking-widest text-[#2563EB] uppercase leading-none">
                                Marketplace
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <Link
                            href="/"
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F1F5F9] hover:text-[#2563EB] transition dark:text-[#F8FAFC] dark:hover:bg-[#1E293B]"
                        >
                            All Products
                        </Link>
                        <Link
                            href="/shops"
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#2563EB] transition dark:text-[#94A3B8] dark:hover:bg-[#1E293B]"
                        >
                            <Store className="h-3.5 w-3.5 text-[#2563EB]" />
                            <span>Boutiques</span>
                        </Link>
                    </nav>
                </div>

               

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    {/* Theme Toggle Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-2 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition shadow-2xs dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#94A3B8] dark:hover:text-white"
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
                        className="relative flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#0F172A] shadow-2xs transition hover:border-[#2563EB] hover:bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                        aria-label="View shopping bag"
                    >
                        <ShoppingBag className="h-4 w-4 text-[#2563EB]" />
                        <span className="hidden sm:inline">Bag</span>
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-bold text-white shadow-2xs">
                            {totalCount}
                        </span>
                    </button>

                    {/* User Authentication Actions */}
                    {user ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                type="button"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-1.5 pr-3 text-xs font-semibold text-[#0F172A] shadow-2xs transition hover:border-[#2563EB] hover:bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white uppercase shadow-xs">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <span className="block text-xs font-bold leading-tight text-[#0F172A] dark:text-[#F8FAFC]">
                                        {user.name}
                                    </span>
                                    <span className="block text-[10px] text-[#64748B] font-medium leading-none mt-0.5">
                                        {user.role === 'admin'
                                            ? 'Administrator'
                                            : user.role === 'shop_owner'
                                              ? 'Shop Owner'
                                              : 'Customer'}
                                    </span>
                                </div>
                                <ChevronDown className={`h-3.5 w-3.5 text-[#64748B] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-1.5 shadow-xl z-50 dark:border-[#334155] dark:bg-[#1E293B]">
                                    <div className="border-b border-[#E2E8F0] px-3.5 py-2.5 dark:border-[#334155]">
                                        <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                            {user.name}
                                        </p>
                                        <p className="text-[11px] text-[#64748B] truncate">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        {user.role === 'customer' ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUserMenuOpen(false);
                                                    onOpenUpcoming();
                                                }}
                                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition dark:text-[#F8FAFC] dark:hover:bg-blue-950/50"
                                            >
                                                <LayoutDashboard className="h-4 w-4 text-[#2563EB]" />
                                                <span>My Dashboard</span>
                                            </button>
                                        ) : (
                                            <Link
                                                href={
                                                    user.role === 'admin'
                                                        ? '/admin/dashboard'
                                                        : '/shop-owner/dashboard'
                                                }
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition dark:text-[#F8FAFC] dark:hover:bg-blue-950/50"
                                            >
                                                <LayoutDashboard className="h-4 w-4 text-[#2563EB]" />
                                                <span>
                                                    {user.role === 'admin'
                                                        ? 'Admin Console'
                                                        : 'Merchant Hub'}
                                                </span>
                                            </Link>
                                        )}
                                    </div>

                                    <div className="border-t border-[#E2E8F0] pt-1 dark:border-[#334155]">
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50 transition dark:hover:bg-red-950/40"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Sign Out</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] shadow-2xs transition hover:border-[#2563EB] hover:bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                            >
                                <LogIn className="h-3.5 w-3.5 text-[#64748B]" />
                                <span>Sign In</span>
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
                    {/* Mobile Search */}
                    <form onSubmit={handleNavSearch} className="mb-4">
                        <div className="relative w-full flex items-center">
                            <Search className="absolute left-3.5 h-3.5 w-3.5 text-[#64748B]" />
                            <input
                                type="text"
                                value={navSearch}
                                onChange={(e) => setNavSearch(e.target.value)}
                                placeholder="Search products or shops..."
                                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-9 pr-16 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-none dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 rounded-lg bg-[#2563EB] px-2.5 py-1 text-[11px] font-semibold text-white"
                            >
                                Search
                            </button>
                        </div>
                    </form>

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
                        <Link
                            href="/cart"
                            className="block rounded-xl px-3 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:bg-[#1E293B]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Shopping Bag ({totalCount})
                        </Link>
                        {user ? (
                            user.role === 'customer' ? (
                                <button
                                    type="button"
                                    className="block w-full text-left rounded-xl bg-[#EFF6FF] px-3 py-2 text-sm font-bold text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        onOpenUpcoming();
                                    }}
                                >
                                    My Dashboard
                                </button>
                            ) : (
                                <Link
                                    href={
                                        user.role === 'admin'
                                            ? '/admin/dashboard'
                                            : '/shop-owner/dashboard'
                                    }
                                    className="block rounded-xl bg-[#EFF6FF] px-3 py-2 text-sm font-bold text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {user.role === 'admin'
                                        ? 'Admin Console'
                                        : 'Merchant Hub'}
                                </Link>
                            )
                        ) : (
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
    const [upcomingModalOpen, setUpcomingModalOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-[#F8FAFC] font-sans text-[#0F172A] antialiased selection:bg-[#2563EB] selection:text-white dark:bg-[#0F172A] dark:text-[#F8FAFC]">
            {/* Top Announcement Ribbon */}
            <div className="border-b border-[#E2E8F0] bg-[#FFFFFF] px-4 py-2 text-[11px] font-medium text-[#64748B] sm:px-6 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#94A3B8]">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs">
                        <Truck className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span>Complimentary express delivery on orders over $150</span>
                        <span className="text-slate-300 dark:text-slate-600 mx-2">•</span>
                        <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                        <span>100% Verified Merchant Guarantee</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <Link href="/shops" className="hover:text-[#2563EB] transition">
                            Explore Boutiques
                        </Link>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
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
                onOpenUpcoming={() => setUpcomingModalOpen(true)}
            />

            {/* Main Page Content */}
            <main className="flex-1">{children}</main>

            {/* Upcoming Customer Dashboard Popup Modal */}
            {upcomingModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
                    onClick={() => setUpcomingModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-2xl transition-all dark:border-[#334155] dark:bg-[#1E293B]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Ambient Background Glow */}
                        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setUpcomingModalOpen(false)}
                            className="absolute top-4 right-4 rounded-xl p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition dark:text-[#94A3B8] dark:hover:bg-[#334155] dark:hover:text-white"
                            aria-label="Close dialog"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Header with Icon */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/70 shadow-sm border border-blue-100 dark:border-blue-900/50">
                                <Sparkles className="h-6 w-6 text-[#2563EB] animate-pulse" />
                            </div>
                            <div className="min-w-0 flex-1 pr-6">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#2563EB] uppercase border border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900">
                                        Upcoming Feature
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                                        In Progress
                                    </span>
                                </div>
                                <h3 className="mt-1.5 text-lg font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                                    Customer Dashboard Coming Soon!
                                </h3>
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                            {user ? `Hello ${user.name}! ` : ''}
                            We are actively engineering your personal customer dashboard command center.
                            Very soon, you will be able to track live multi-boutique orders, download VAT invoices, manage saved delivery addresses, and enjoy boutique rewards right from here!
                        </p>

                        {/* Upcoming Roadmap Previews */}
                        <div className="mt-5 space-y-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 dark:border-[#334155] dark:bg-[#0F172A]/70">
                            <p className="text-[11px] font-bold text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                                Upcoming Modules:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
                                    <Package className="h-4 w-4 text-[#2563EB] shrink-0" />
                                    <span>Live Order Tracking</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
                                    <FileText className="h-4 w-4 text-[#2563EB] shrink-0" />
                                    <span>PDF Invoice Downloads</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
                                    <Heart className="h-4 w-4 text-purple-500 shrink-0" />
                                    <span>Wishlist & Boutiques</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
                                    <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <span>Saved Addresses</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setUpcomingModalOpen(false)}
                                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-bold text-[#0F172A] shadow-2xs transition hover:bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F8FAFC] dark:hover:bg-[#334155]"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => setUpcomingModalOpen(false)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1D4ED8]"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                <span>Continue Shopping</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
        </div>
    );
}
