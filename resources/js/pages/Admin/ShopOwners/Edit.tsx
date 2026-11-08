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
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Shop Owners', href: '/admin/shop-owners' },
        { title: `Edit ${shopOwner.name}`, href: `/admin/shop-owners/${shopOwner.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${shopOwner.name} - Admin Panel`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/shop-owners"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Edit Shop Owner: {shopOwner.name}
                        </h1>
                        <p className="text-xs text-slate-500">
                            Update contact credentials or reset password.
                        </p>
                    </div>
                </div>

                <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Merchant Full Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                            )}
                        </div>

                        {/* Reset Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Reset Password (Leave blank to keep existing password)
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter new password if changing..."
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-rose-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Assigned Shops List */}
                        {shopOwner.shops && shopOwner.shops.length > 0 && (
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Currently Assigned Shops
                                </span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {shopOwner.shops.map((s) => (
                                        <span
                                            key={s.id}
                                            className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-200"
                                        >
                                            <Store className="h-3.5 w-3.5 text-indigo-600" />
                                            {s.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <Link
                                href="/admin/shop-owners"
                                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
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
