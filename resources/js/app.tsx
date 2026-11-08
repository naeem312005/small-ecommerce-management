import { createInertiaApp, router } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/context/cart-context';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { notify } from '@/lib/alert';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Listen to flash messages across all Inertia page transitions without needing usePage() in withApp
let lastFlashMsg = '';
router.on('success', (event) => {
    const flash = (
        event.detail.page.props as {
            flash?: { success?: string; error?: string };
        }
    )?.flash;

    if (flash?.success && flash.success !== lastFlashMsg) {
        lastFlashMsg = flash.success;
        notify.success(flash.success);
    } else if (flash?.error && flash.error !== lastFlashMsg) {
        lastFlashMsg = flash.error;
        notify.error(flash.error);
    }
});

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name.startsWith('Customer/'):
            case name.startsWith('Admin/'):
            case name.startsWith('ShopOwner/'):
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                <CartProvider>
                    {app}
                    <Toaster position="top-right" richColors closeButton />
                </CartProvider>
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
