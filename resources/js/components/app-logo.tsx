import { usePage } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';
import React from 'react';
import type { User } from '@/types';

export default function AppLogo() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const role = auth?.user?.role;

    return (
        <div className="flex items-center gap-2.5">
            <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/20">
                <ShoppingBag className="size-4" />
            </div>
            <div className="grid flex-1 text-left leading-none">
                <span className="font-serif text-sm font-black tracking-tight text-foreground">
                    VELORA
                </span>
                <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    {role === 'admin'
                        ? 'Admin Console'
                        : role === 'shop_owner'
                          ? 'Merchant Hub'
                          : 'Marketplace'}
                </span>
            </div>
        </div>
    );
}
