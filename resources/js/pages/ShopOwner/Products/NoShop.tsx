import { Head, Link } from '@inertiajs/react';
import { Store } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Props = {
    message?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shop Management', href: '/shop-owner/dashboard' },
    { title: 'My Shop Products', href: '/shop-owner/products' },
];

export default function ShopOwnerNoShop({ message }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="No Shop Assigned - Shop Management" />

            <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    <Store className="h-8 w-8" />
                </div>
                <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    No Shop Assigned
                </h2>
                <p className="mt-2 max-w-md text-xs text-slate-500">
                    {message || 'Your account does not currently have a shop assigned to it. Please contact an administrator to assign a shop to your profile.'}
                </p>
                <Link
                    href="/"
                    className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                    Return to Storefront
                </Link>
            </div>
        </AppLayout>
    );
}

