import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Store } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Shop, User } from '@/types';

type Props = {
    shop: Shop;
    shopOwners: Pick<User, 'id' | 'name' | 'email'>[];
};

export default function AdminShopsEdit({ shop, shopOwners }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Console', href: '/admin/dashboard' },
        { title: 'Merchant Shops', href: '/admin/shops' },
        { title: `Edit ${shop.name}`, href: `/admin/shops/${shop.id}/edit` },
    ];
    const { data, setData, processing, errors } = useForm({
        user_id: String(shop.user_id),
        name: shop.name,
        description: shop.description || '',
        email: shop.email || '',
        phone: shop.phone || '',
        address: shop.address || '',
        is_active: shop.is_active,
        logo: null as File | null,
        banner: null as File | null,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(shop.logo);
    const [bannerPreview, setBannerPreview] = useState<string | null>(shop.banner);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('banner', file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/shops/${shop.id}`, {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${shop.name} - Admin Panel`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/shops"
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Edit Shop: {shop.name}
                        </h1>
                        <p className="text-xs text-slate-500">
                            Update store credentials, owner assignment, and storefront branding.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Shop Owner Assignment */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Assigned Shop Owner (Merchant) *
                            </label>
                            <select
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                required
                            >
                                {shopOwners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>
                                        {owner.name} ({owner.email})
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && (
                                <p className="mt-1 text-xs text-rose-500">{errors.user_id}</p>
                            )}
                        </div>

                        {/* Shop Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Shop Name *
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

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Storefront Description
                            </label>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
                            )}
                        </div>

                        {/* Contact details */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Shop Contact Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 py-2 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Shop Contact Phone
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-slate-300 py-2 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Physical Address / City
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
                            />
                            {errors.address && (
                                <p className="mt-1 text-xs text-rose-500">{errors.address}</p>
                            )}
                        </div>

                        {/* Media Uploads */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Shop Logo
                                </label>
                                <div className="mt-1.5 flex items-center gap-4">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Preview"
                                            className="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-300"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                            <Store className="h-6 w-6" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:py-1.5 file:px-3 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                </div>
                                {errors.logo && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.logo}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Storefront Banner
                                </label>
                                <div className="mt-1.5 flex items-center gap-4">
                                    {bannerPreview && (
                                        <img
                                            src={bannerPreview}
                                            alt="Banner Preview"
                                            className="h-14 w-24 rounded-xl object-cover ring-1 ring-slate-300"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerChange}
                                        className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:py-1.5 file:px-3 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                </div>
                                {errors.banner && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.banner}</p>
                                )}
                            </div>
                        </div>

                        {/* Active toggle */}
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="is_active" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Active Shop (Visible to customers on storefront)
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <Link
                                href="/admin/shops"
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

