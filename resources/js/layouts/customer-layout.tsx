import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    ChevronDown,
    Globe,
    Key,
    Layers,
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    Package,
    Shield,
    ShoppingBag,
    Store,
    User as UserIcon,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import type { User } from '@/types';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    const { auth, flash } = usePage<{
        auth: { user: User | null };
        flash: { success?: string; error?: string };
    }>().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [demoModalOpen, setDemoModalOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
            {/* Top Announcement Bar */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 px-4 py-2 text-xs text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-200">
                            Candidate Assessment
                        </span>
                        <span className="hidden sm:inline text-indigo-100">
                            Small E-commerce Management • Multi-Shop Shared Catalog System
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setDemoModalOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-slate-950 shadow-sm transition hover:bg-amber-300"
                        >
                            <Key className="h-3 w-3" />
                            <span>Quick Demo Accounts</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                    ShopCatalog<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
                                </span>
                                <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                    Shared Product Platform
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-6 md:flex">
                            <Link
                                href="/"
                                className="text-sm font-medium text-slate-700 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                            >
                                Shop Products Showcase
                            </Link>
                            <Link
                                href="/shops"
                                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                            >
                                <Store className="h-4 w-4 text-slate-400" />
                                Browse Shops
                            </Link>
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900"
                                >
                                    <LayoutDashboard className="h-3.5 w-3.5" />
                                    <span>
                                        {user.role === 'admin'
                                            ? 'Admin Panel'
                                            : user.role === 'shop_owner'
                                              ? 'Shop Panel'
                                              : 'Dashboard'}
                                    </span>
                                </Link>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    <LogIn className="h-3.5 w-3.5" />
                                    <span>Sign In</span>
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                                >
                                    <span>Admin / Shop Owner</span>
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {mobileMenuOpen && (
                    <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-900">
                        <div className="space-y-2">
                            <Link
                                href="/"
                                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Shop Products Showcase
                            </Link>
                            <Link
                                href="/shops"
                                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Browse All Shops
                            </Link>
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setDemoModalOpen(true);
                                    }}
                                    className="flex w-full items-center justify-between rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-200"
                                >
                                    <span>View Demo Credentials</span>
                                    <Key className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-center text-sm font-medium text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-center text-sm font-medium text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300">
                    {flash.error}
                </div>
            )}

            {/* Main Page Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                    <ShoppingBag className="h-4 w-4" />
                                </div>
                                <span className="text-base font-bold text-slate-900 dark:text-white">
                                    Small E-commerce Management
                                </span>
                            </div>
                            <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">
                                A high-performance multi-shop e-commerce system featuring shared master catalogs, shop-specific price overrides, custom descriptions, and strict catalog isolation for customer storefronts.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                <span>Built with Laravel 12 + React + Inertia.js + Tailwind CSS + MySQL</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                                Navigation
                            </h4>
                            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li>
                                    <Link href="/" className="hover:text-indigo-600">
                                        Assigned Shop Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shops" className="hover:text-indigo-600">
                                        All Active Shops
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="hover:text-indigo-600">
                                        Sign In Portal
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                                Submission Contact
                            </h4>
                            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                    Candidate: Md Naimul Hasan Naeem
                                </p>
                                <p className="text-xs">Email: career@csnbangladesh.com</p>
                                <button
                                    type="button"
                                    onClick={() => setDemoModalOpen(true)}
                                    className="mt-2 text-xs font-medium text-indigo-600 underline hover:text-indigo-500"
                                >
                                    View Test Credentials
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800">
                        © 2026 Small E-commerce Management Platform. All functional requirements implemented.
                    </div>
                </div>
            </footer>

            {/* Quick Demo Credentials Modal */}
            {demoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                                    <Key className="h-4 w-4" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Demo Credentials</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDemoModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                            You can log in with any of these pre-seeded test accounts to explore the respective administrator and shop owner workflows:
                        </p>

                        <div className="mt-4 space-y-3">
                            {/* Admin */}
                            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3.5 dark:border-indigo-900 dark:bg-indigo-950/40">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                        <Shield className="h-3 w-3" /> ADMIN
                                    </span>
                                    <span className="text-[11px] font-mono text-slate-500">password: password123</span>
                                </div>
                                <p className="mt-2 font-mono text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                                    admin@ecommerce.com
                                </p>
                                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                                    Can manage all shops, master products catalog, and shop owner accounts.
                                </p>
                            </div>

                            {/* Shop Owner 1 */}
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/40">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                        <Store className="h-3 w-3" /> SHOP OWNER (TechNova)
                                    </span>
                                    <span className="text-[11px] font-mono text-slate-500">password: password123</span>
                                </div>
                                <p className="mt-2 font-mono text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                                    tech@ecommerce.com
                                </p>
                                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                                    Owns "TechNova Gadgets". Can browse shared catalog, customize prices/details, and contribute products.
                                </p>
                            </div>

                            {/* Shop Owner 2 */}
                            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-3.5 dark:border-violet-900 dark:bg-violet-950/40">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 rounded bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                        <Store className="h-3 w-3" /> SHOP OWNER (Aura Apparel)
                                    </span>
                                    <span className="text-[11px] font-mono text-slate-500">password: password123</span>
                                </div>
                                <p className="mt-2 font-mono text-xs font-semibold text-violet-900 dark:text-violet-200">
                                    fashion@ecommerce.com
                                </p>
                                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                                    Owns "Aura Apparel & Co.". Also lists the headphones from catalog with luxury custom pricing.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDemoModalOpen(false)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                            >
                                Close
                            </button>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                            >
                                <span>Go to Login</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
