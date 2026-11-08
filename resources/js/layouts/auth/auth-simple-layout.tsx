import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Moon, ShieldCheck, ShoppingBag, Sun } from 'lucide-react';
import React from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { url } = usePage();
    const isRegister = url.startsWith('/register');
    const isLogin = url.startsWith('/login');

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A] transition-colors dark:bg-[#0F172A] dark:text-[#F8FAFC]">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]/80 bg-white/70 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors dark:text-slate-400 dark:hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Storefront</span>
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="rounded-xl border border-[#E2E8F0] bg-white p-2 text-[#64748B] shadow-2xs hover:text-[#0F172A] hover:border-[#2563EB] transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                            <Moon className="h-4 w-4 text-slate-600" />
                        )}
                    </button>
                </div>
            </header>

            {/* Main Center Area */}
            <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-md">
                    {/* Brand Header */}
                    <div className="mb-6 flex flex-col items-center text-center">
                        <Link href="/" className="group flex flex-col items-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="font-serif text-xl font-black tracking-tight text-[#0F172A] dark:text-white">
                                    VELORA MARKET
                                </span>
                                <span className="rounded-full bg-[#2563EB]/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] border border-[#2563EB]/20">
                                    Curated
                                </span>
                            </div>
                        </Link>
                        <p className="mt-1 text-xs text-[#64748B] dark:text-slate-400">
                            Multi-Vendor Commerce • Shared Artisan Catalog
                        </p>
                    </div>

                    {/* Card Container */}
                    <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60 transition-all dark:border-slate-800 dark:bg-[#1E293B] dark:shadow-none">
                        {/* Tab Switcher */}
                        {(isLogin || isRegister) && (
                            <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-2xl bg-[#F1F5F9] p-1.5 text-xs font-bold dark:bg-slate-800/80">
                                <Link
                                    href="/login"
                                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2 transition-all ${
                                        isLogin
                                            ? 'bg-white text-[#2563EB] shadow-xs dark:bg-slate-900 dark:text-white'
                                            : 'text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    <span>Sign In</span>
                                </Link>
                                <Link
                                    href="/register"
                                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2 transition-all ${
                                        isRegister
                                            ? 'bg-white text-[#2563EB] shadow-xs dark:bg-slate-900 dark:text-white'
                                            : 'text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    <span>Create Account</span>
                                </Link>
                            </div>
                        )}

                        {title && (
                            <div className="mb-5 text-center">
                                <h1 className="text-lg font-black tracking-tight text-[#0F172A] dark:text-white">
                                    {title}
                                </h1>
                                {description && (
                                    <p className="mt-1 text-xs text-[#64748B] dark:text-slate-400">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}

                        {children}
                    </div>

                    {/* Footer Trust & Copyright */}
                    <div className="mt-6 flex flex-col items-center gap-2 text-center text-[11px] text-[#64748B] dark:text-slate-500">
                        <div className="inline-flex items-center gap-1.5 text-[#16A34A] font-semibold">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>256-Bit SSL Encrypted • Verified Multi-Tenant Isolation</span>
                        </div>
                        <p>© 2026 Velora Market. All rights reserved.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
