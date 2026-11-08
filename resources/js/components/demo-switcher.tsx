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
            {/* <div className="fixed bottom-5 right-5 z-40">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center gap-2 rounded-full border border-border bg-[#0F172A] px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md transition hover:scale-105 hover:bg-slate-800 hover:ring-2 hover:ring-primary/40"
                    title="Quick Role Switcher for Evaluation"
                >
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <Key className="h-3.5 w-3.5 text-amber-400" />
                    <span>Role Switcher</span>
                    {currentUser && (
                        <span className="rounded-full bg-primary/60 px-2 py-0.5 text-[10px] font-bold text-white">
                            {currentUser.role === 'admin'
                                ? 'Admin'
                                : currentUser.role === 'shop_owner'
                                  ? 'Merchant'
                                  : 'Customer'}
                        </span>
                    )}
                </button>
            </div> */}

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xs"
                    />

                    <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md">
                                    <Key className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">
                                        Evaluation Role Switcher
                                    </h3>
                                    <p className="text-[11px] text-muted-foreground">
                                        Instant 1-click login into any pre-seeded persona
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Current Status */}
                        {currentUser && (
                            <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary px-4 py-2.5 text-xs text-foreground">
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
                            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 transition hover:border-primary">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-foreground">
                                                Platform Administrator
                                            </h4>
                                            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                                                admin
                                            </span>
                                        </div>
                                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                            admin@ecommerce.com
                                        </p>
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                            Shop CRUD, Master Product Catalog CRUD, Shop Owner management.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => switchAccount('admin@ecommerce.com')}
                                    disabled={switching !== null}
                                    className="ml-3 shrink-0 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {switching === 'admin@ecommerce.com' ? 'Switching...' : 'Switch Role'}
                                </button>
                            </div>

                            {/* Shop Owner 1 */}
                            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 transition hover:border-emerald-500">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                                        <Store className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-foreground">
                                                TechNova Gadgets (Owner)
                                            </h4>
                                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                shop_owner
                                            </span>
                                        </div>
                                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                            tech@ecommerce.com
                                        </p>
                                        <p className="mt-1 text-[11px] text-muted-foreground">
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
                            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 transition hover:border-primary">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                                        <Store className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-foreground">
                                                Aura Apparel & Co. (Owner)
                                            </h4>
                                            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                                                shop_owner
                                            </span>
                                        </div>
                                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                            fashion@ecommerce.com
                                        </p>
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                            Fashion & luxury lifestyle; also shared catalog products with custom markup.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => switchAccount('fashion@ecommerce.com')}
                                    disabled={switching !== null}
                                    className="ml-3 shrink-0 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {switching === 'fashion@ecommerce.com' ? 'Switching...' : 'Switch Role'}
                                </button>
                            </div>

                            {/* Customer */}
                            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 transition hover:border-secondary">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-white shadow-sm">
                                        <UserIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-foreground">
                                                Registered Customer
                                            </h4>
                                            <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-secondary-foreground">
                                                customer
                                            </span>
                                        </div>
                                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                            customer@ecommerce.com
                                        </p>
                                        <p className="mt-1 text-[11px] text-muted-foreground">
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
                        <div className="mt-5 border-t border-border pt-3 text-center text-[11px] text-muted-foreground">
                            Default password for all accounts:{' '}
                            <code className="font-mono font-bold text-foreground">
                                password123
                            </code>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

