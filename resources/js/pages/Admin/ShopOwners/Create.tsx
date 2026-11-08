import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, User as UserIcon } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin/dashboard' },
    { title: 'Merchant Accounts', href: '/admin/shop-owners' },
    { title: 'Register Merchant', href: '/admin/shop-owners/create' },
];

export default function AdminShopOwnersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/shop-owners');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Shop Owner Account — Admin Console" />

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
                            Create Shop Owner Account
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Register a new merchant user account capable of managing shops and shared catalog listings.
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
                                placeholder="e.g. John Doe, Sarah Connor"
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
                                Email Address (Login Username) *
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="merchant@ecommerce.com"
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
                                placeholder="+1 (555) 123-4567"
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Initial Account Password *
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimum 8 characters"
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                required
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-destructive">{errors.password}</p>
                            )}
                        </div>

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
                                <span>{processing ? 'Registering...' : 'Register Merchant'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
