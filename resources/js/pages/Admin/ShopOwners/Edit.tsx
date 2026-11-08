import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Store, User as UserIcon } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';

type Props = {
    shopOwner: User;
};

export default function AdminShopOwnersEdit({ shopOwner }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: shopOwner.name,
        email: shopOwner.email,
        phone: shopOwner.phone || '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/shop-owners/${shopOwner.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Console', href: '/admin/dashboard' },
        { title: 'Merchant Accounts', href: '/admin/shop-owners' },
        { title: `Edit ${shopOwner.name}`, href: `/admin/shop-owners/${shopOwner.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${shopOwner.name} — Admin Console`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/shop-owners"
                        className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground shadow-2xs transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">
                            Edit Shop Owner: {shopOwner.name}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Update contact credentials or reset password.
                        </p>
                    </div>
                </div>

                <div className="max-w-xl rounded-2xl border border-border bg-card p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Merchant Full Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                            )}
                        </div>

                        {/* Optional Password Reset */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                New Password (Leave blank to keep existing password)
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter new password if changing"
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-destructive">{errors.password}</p>
                            )}
                        </div>

                        {/* Assigned Shop Info Card */}
                        {shopOwner.shops && shopOwner.shops.length > 0 && (
                            <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                                <span className="block text-[11px] font-bold text-foreground">
                                    Assigned Storefront:
                                </span>
                                <div className="mt-2 flex items-center gap-2 text-xs text-foreground font-semibold">
                                    <Store className="h-4 w-4 text-primary" />
                                    <span>{shopOwner.shops[0].name}</span>
                                    <span className="font-mono text-[11px] text-muted-foreground">
                                        (/shops/{shopOwner.shops[0].slug})
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 border-t border-border pt-5">
                            <Link
                                href="/admin/shop-owners"
                                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50 transition"
                            >
                                <Save className="h-3.5 w-3.5" />
                                <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
