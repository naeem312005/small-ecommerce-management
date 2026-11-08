import { router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Key,
    Layers,
    LogIn,
    LogOut,
    Shield,
    Sparkles,
    Store,
    User as UserIcon,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import type { User } from '@/types';

export default function DemoSwitcher() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const currentUser = auth?.user;
    const [isOpen, setIsOpen] = useState(false);
    const [switching, setSwitching] = useState<string | null>(null);

    const switchAccount = (email: string) => {
        setSwitching(email);
        router.post(
            '/demo-switch',
            { email },
            {
                onFinish: () => {
                    setSwitching(null);
                    setIsOpen(false);
                },
            }
        );
    };

    return (
        <>
            {/* Floating Action Pill in Bottom Right */}
            <div className="fixed bottom-5 right-5 z-40">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md transition hover:scale-105 hover:bg-slate-800 hover:ring-2 hover:ring-indigo-500/40"
                    title="Quick Role Switcher for Evaluation"
                >
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <Key className="h-3.5 w-3.5 text-amber-400" />
                    <span>Role Switcher</span>
                    {currentUser && (
                        <span className="rounded-full bg-indigo-600/60 px-2 py-0.5 text-[10px] font-bold text-indigo-200">
                            {currentUser.role === 'admin'
                                ? 'Admin'
                                : currentUser.role === 'shop_owner'
                                  ? 'Merchant'
                                  : 'Customer'}
                        </span>
                    )}
                </button>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
                    />

                    <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-md">
                                    <Key className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Evaluation Role Switcher
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Instant 1-click login into any pre-seeded persona
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Current Status */}
                        {currentUser && (
                            <div className="mt-4 flex items-center justify-between rounded-2xl bg-indigo-50/70 px-4 py-2.5 text-xs text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    <span>
                                        Active User: <strong>{currentUser.name}</strong> ({currentUser.email})
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.post('/logout')}
                                    className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:underline dark:text-rose-400"
                                >
                                    <LogOut className="h-3 w-3" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}

                        {/* Role Cards */}
                        <div className="mt-4 space-y-2.5">
                            {/* Administrator */}
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-800/40">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Platform Administrator
                                            </h4>
                                            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                admin
                                            </span>
                                        </div>
                                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                                            admin@ecommerce.com
                                        </p>
                                        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                                            Shop CRUD, Master Product Catalog CRUD, Shop Owner management.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => switchAccount('admin@ecommerce.com')}
                                    disabled={switching !== null}
                                    className="ml-3 shrink-0 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    {switching === 'admin@ecommerce.com' ? 'Switching...' : 'Switch Role'}
                                </button>
                            </div>

                            {/* Shop Owner 1 */}
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 transition hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-800/40">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                                        <Store className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                TechNova Gadgets (Owner)
                                            </h4>
                                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                shop_owner
                                            </span>
                                        </div>
                                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                                            tech@ecommerce.com
                                        </p>
                                        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                                            Lists electronics from shared catalog; custom prices & thumbnails.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => switchAccount('tech@ecommerce.com')}
                                    disabled={switching !== null}
                                    className="ml-3 shrink-0 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-50"
                                >
                                    {switching === 'tech@ecommerce.com' ? 'Switching...' : 'Switch Role'}
                                </button>
                            </div>

                            {/* Shop Owner 2 */}
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 transition hover:border-violet-300 dark:border-slate-800 dark:bg-slate-800/40">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
                                        <Store className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Aura Apparel & Co. (Owner)
                                            </h4>
                                            <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                                                shop_owner
                                            </span>
                                        </div>
                                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                                            fashion@ecommerce.com
                                        </p>
                                        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                                            Fashion & luxury lifestyle; also shared catalog products with custom markup.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => switchAccount('fashion@ecommerce.com')}
                                    disabled={switching !== null}
                                    className="ml-3 shrink-0 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-violet-500 disabled:opacity-50"
                                >
                                    {switching === 'fashion@ecommerce.com' ? 'Switching...' : 'Switch Role'}
                                </button>
                            </div>

                            {/* Customer */}
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-white shadow-sm">
                                        <UserIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Registered Customer
                                            </h4>
                                            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                                customer
                                            </span>
                                        </div>
                                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                                            customer@ecommerce.com
                                        </p>
                                        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                                            Public customer view; only sees shop-assigned products.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => switchAccount('customer@ecommerce.com')}
                                    disabled={switching !== null}
                                    className="ml-3 shrink-0 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50"
                                >
                                    {switching === 'customer@ecommerce.com' ? 'Switching...' : 'Switch Role'}
                                </button>
                            </div>
                        </div>

                        {/* Footer note */}
                        <div className="mt-5 border-t border-slate-100 pt-3 text-center text-[11px] text-slate-500 dark:border-slate-800">
                            Default password for all accounts:{' '}
                            <code className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                password123
                            </code>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

