import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { notify } from '@/lib/alert';

export default function FlashToaster() {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const lastFlashRef = useRef<string | null>(null);

    useEffect(() => {
        if (flash?.success && flash.success !== lastFlashRef.current) {
            lastFlashRef.current = flash.success;
            notify.success(flash.success);
        } else if (flash?.error && flash.error !== lastFlashRef.current) {
            lastFlashRef.current = flash.error;
            notify.error(flash.error);
        }
    }, [flash]);

    return null;
}

