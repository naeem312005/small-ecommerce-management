import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Store, Upload } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';

type Props = {
    shopOwners: Pick<User, 'id' | 'name' | 'email'>[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin/dashboard' },
    { title: 'Merchant Shops', href: '/admin/shops' },
    { title: 'Create Shop', href: '/admin/shops/create' },
];

export default function AdminShopsCreate({ shopOwners }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: shopOwners[0]?.id ? String(shopOwners[0].id) : '',
        name: '',
        description: '',
        email: '',
        phone: '',
        address: '',
        is_active: true,
        logo: null as File | null,
        banner: null as File | null,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

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
        post('/admin/shops');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Shop — Admin Console" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/shops"
                        className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground shadow-2xs transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">
                            Create New Shop
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Configure a store and assign it to a registered shop owner merchant.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Shop Owner Assignment */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Assign Shop Owner (Merchant) *
                            </label>
                            <select
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                required
                            >
                                <option value="" disabled>
                                    Select a shop owner account...
                                </option>
                                {shopOwners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>
                                        {owner.name} ({owner.email})
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && (
                                <p className="mt-1 text-xs text-destructive">{errors.user_id}</p>
                            )}
                        </div>

                        {/* Shop Name */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Shop Name *
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Apex Electronics, Bloom Studio"
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2.5 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Storefront Description
                            </label>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the shop's brand and offerings..."
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-destructive">{errors.description}</p>
                            )}
                        </div>

                        {/* Contact details */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold text-foreground">
                                    Shop Contact Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="contact@shop.com"
                                    className="mt-1.5 w-full rounded-xl border border-input bg-background py-2 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-foreground">
                                    Shop Contact Phone
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className="mt-1.5 w-full rounded-xl border border-input bg-background py-2 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-bold text-foreground">
                                Physical Address / City
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="123 Commerce St, New York, NY"
                                className="mt-1.5 w-full rounded-xl border border-input bg-background py-2 px-3 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.address && (
                                <p className="mt-1 text-xs text-destructive">{errors.address}</p>
                            )}
                        </div>

                        {/* Media Uploads */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Logo */}
                            <div>
                                <label className="block text-xs font-bold text-foreground">
                                    Shop Logo
                                </label>
                                <div className="mt-1.5 flex items-center gap-4">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Preview"
                                            className="h-14 w-14 rounded-2xl object-cover ring-1 ring-border shadow-2xs"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                            <Store className="h-6 w-6" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="text-xs file:mr-2 file:rounded-xl file:border-0 file:bg-primary/10 file:py-1.5 file:px-3 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20 transition"
                                    />
                                </div>
                                {errors.logo && (
                                    <p className="mt-1 text-xs text-destructive">{errors.logo}</p>
                                )}
                            </div>

                            {/* Banner */}
                            <div>
                                <label className="block text-xs font-bold text-foreground">
                                    Storefront Banner
                                </label>
                                <div className="mt-1.5 flex items-center gap-4">
                                    {bannerPreview ? (
                                        <img
                                            src={bannerPreview}
                                            alt="Banner Preview"
                                            className="h-14 w-24 rounded-xl object-cover ring-1 ring-border shadow-2xs"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-24 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerChange}
                                        className="text-xs file:mr-2 file:rounded-xl file:border-0 file:bg-primary/10 file:py-1.5 file:px-3 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20 transition"
                                    />
                                </div>
                                {errors.banner && (
                                    <p className="mt-1 text-xs text-destructive">{errors.banner}</p>
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
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <label htmlFor="is_active" className="text-xs font-semibold text-foreground">
                                Active Shop (Visible to customers on storefront)
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 border-t border-border pt-5">
                            <Link
                                href="/admin/shops"
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
                                <span>{processing ? 'Creating...' : 'Create Shop'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
